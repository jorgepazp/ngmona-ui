#!/usr/bin/env node
// Visual smoke test for the CLI's Tailwind prefix support: every page of the docs app, built as-is
// and built with every template/TS file run through the same prefixer `ngmona add` uses (plus
// `@import 'tailwindcss' prefix(tw)`), must render identically.
//
//   1. Copies the app to <os tmp>/ngmona-prefix-smoke/plain (as-is) and …/prefixed, and rewrites the latter for prefix(tw): all component and docs
//      page sources through the prefixer, `@theme` var() references through prefixThemeReferences,
//      and the docs app's own direct uses of theme variables (dark-mode overrides, the theme editor's
//      setProperty calls) to the `--tw-` names — exactly what the docs tell a consumer to do.
//   2. Builds both apps (ng build, development configuration).
//   3. Serves both and drives headless Chrome over the DevTools protocol (no extra dependencies):
//      for every route, compares the computed style of every element (and its ::before/::after),
//      then opens the page's first overlay trigger and compares again, overlay container included.
//      Screenshots of both builds land in <os tmp>/ngmona-prefix-smoke/screenshots for eyeballing.
//
// Run: npm run test:prefix-smoke            (CHROME_PATH=... to point at a specific Chrome/Edge)

import { spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDesignSystemDetector, loadTypeScript } from '../packages/cli/src/lib/prefix/load-deps.js';
import { createPrefixer } from '../packages/cli/src/lib/prefix/rewrite.js';
import { prefixThemeReferences } from '../packages/cli/src/lib/prefix/theme.js';
import { prefixToken } from '../packages/cli/src/lib/prefix/token.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLI_ROOT = join(ROOT, 'packages', 'cli');
// Outside the repo on purpose: Tailwind's automatic source detection skips gitignored paths, and
// the repo ignores /tmp — a copy of the app under it would compile with no utilities at all.
const WORK = join(tmpdir(), 'ngmona-prefix-smoke');
const PLAIN_APP = join(WORK, 'plain');
const APP = join(WORK, 'prefixed');
const PREFIX = 'tw';

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  rmSync(WORK, { recursive: true, force: true });
  mkdirSync(WORK, { recursive: true });

  console.log('1/4 Copying the docs app and rewriting it for prefix(tw)…');
  copyApp(PLAIN_APP, join(WORK, 'dist-plain'));
  copyApp(APP, join(WORK, 'dist-prefixed'));
  await preparePrefixedApp();

  console.log('2/4 Building both apps…');
  build(PLAIN_APP);
  build(APP);

  console.log('3/4 Rendering every route in headless Chrome…');
  const routes = readRoutes();
  const plain = await serve(join(WORK, 'dist-plain', 'browser'));
  const prefixed = await serve(join(WORK, 'dist-prefixed', 'browser'));
  const chrome = await launchChrome();
  const failures = [];
  try {
    for (const route of routes) {
      const a = await capture(chrome, `${plain.url}/${route}`, join('plain', slug(route)));
      const b = await capture(chrome, `${prefixed.url}/${route}`, join('prefixed', slug(route)));
      const problems = [...compare('page', a.page, b.page), ...compare('overlay', a.overlay, b.overlay)];
      if (b.errors.length > a.errors.length) problems.push(`runtime errors: ${b.errors.join(' | ')}`);
      if (!b.page || b.page.length < 20) problems.push('page rendered (almost) nothing');
      console.log(`  ${problems.length ? '✗' : '✓'} /${route}  (${b.page?.length ?? 0} elements${b.overlay ? `, overlay ${b.overlay.length}` : ''})`);
      for (const p of problems.slice(0, 5)) console.log(`      ${p}`);
      if (problems.length) failures.push(route);
    }
  } finally {
    chrome.close();
    plain.close();
    prefixed.close();
  }

  console.log(`4/4 ${routes.length - failures.length}/${routes.length} routes render identically. Screenshots: ${join(WORK, 'screenshots')}`);
  if (failures.length) process.exit(1);
}

// -------------------------------------------------------------------------------------------------
// 1. Prefixed copy of the app

/** A buildable copy of the docs app whose build output goes to `outputPath`. */
function copyApp(dest, outputPath) {
  mkdirSync(dest, { recursive: true });
  for (const file of ['package.json', 'tsconfig.json', 'tsconfig.app.json', '.postcssrc.json']) cpSync(join(ROOT, file), join(dest, file));
  cpSync(join(ROOT, 'src'), join(dest, 'src'), { recursive: true });
  cpSync(join(ROOT, 'public'), join(dest, 'public'), { recursive: true });
  symlinkSync(join(ROOT, 'node_modules'), join(dest, 'node_modules'), 'junction');
  const angular = JSON.parse(readFileSync(join(ROOT, 'angular.json'), 'utf8'));
  angular.projects['ui-kit'].architect.build.options.outputPath = outputPath.replace(/\\/g, '/');
  writeFileSync(join(dest, 'angular.json'), JSON.stringify(angular, null, 2));
}

async function preparePrefixedApp() {
  const styles = join(APP, 'src', 'styles');
  const cssFiles = [join(APP, 'src', 'styles.css'), ...readdirSync(styles).map((f) => join(styles, f))];

  // The docs app's theme: its own @theme blocks, with every other @import dropped.
  const themeCss = cssFiles
    .map((f) => readFileSync(f, 'utf8').replace(/^@import[^;]*;/gm, ''))
    .join('\n');
  const { isUtility } = await loadDesignSystemDetector({ cwd: ROOT, packageRoot: CLI_ROOT, themeCss });
  const prefixer = createPrefixer({ prefix: PREFIX, isUtility, ts: loadTypeScript(ROOT, CLI_ROOT) });

  let rewritten = 0;
  let flagged = 0;
  for (const file of walk(join(APP, 'src', 'app'))) {
    if (!/\.(ts|html)$/.test(file) || file.endsWith('.spec.ts')) continue;
    const text = readFileSync(file, 'utf8');
    const result = prefixer.rewriteFile(file, text);
    rewritten += result.changes.length;
    flagged += result.flags.length;
    let content = result.content;
    if (file.endsWith('.ts') && !file.includes(`${join('app', 'registry')}`)) {
      // Docs-app code that addresses theme variables by name (theme editor, theming guide).
      content = content.replace(/(var\(|[`'"])--(?!tw-)(?=(color|radius|spacing|font|text|shadow)-)/g, `$1--${PREFIX}-`);
    }
    if (content !== text) writeFileSync(file, content);
  }

  const themeNames = themeVariableNames(themeCss);
  for (const file of cssFiles) {
    let css = prefixThemeReferences(readFileSync(file, 'utf8'), PREFIX);
    css = outsideThemeBlocks(css, (chunk) =>
      chunk.replace(/--([\w-]+)/g, (m, name) => (themeNames.has(name) ? `--${PREFIX}-${name}` : m)),
    );
    css = css.replace(/@import\s+'tailwindcss'\s*;/, `@import 'tailwindcss' prefix(${PREFIX});`);
    // With a prefix, @apply only accepts prefixed classes too.
    css = css.replace(/@apply\s+([^;]+);/g, (_, list) =>
      `@apply ${list.trim().split(/\s+/).map((t) => (isUtility(t) ? prefixToken(t, PREFIX) : t)).join(' ')};`,
    );
    writeFileSync(file, css);
  }
  console.log(`  ${rewritten} classes rewritten, ${flagged} flagged`);
}

/** Every custom property declared in an @theme block, plus Tailwind's own default theme. */
function themeVariableNames(themeCss) {
  const tailwindTheme = readFileSync(join(dirname(createRequire(join(ROOT, 'x.js')).resolve('tailwindcss/package.json')), 'theme.css'), 'utf8');
  const names = new Set();
  for (const css of [themeCss, tailwindTheme]) {
    for (const block of css.matchAll(/@theme\b[^{]*\{([\s\S]*?)\n\}/g)) {
      for (const m of block[1].matchAll(/--([\w-]+)\s*:/g)) names.add(m[1]);
    }
  }
  return names;
}

function outsideThemeBlocks(css, fn) {
  let out = '';
  let cursor = 0;
  for (const m of css.matchAll(/@theme\b[^{]*\{[\s\S]*?\n\}/g)) {
    out += fn(css.slice(cursor, m.index)) + m[0];
    cursor = m.index + m[0].length;
  }
  return out + fn(css.slice(cursor));
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// -------------------------------------------------------------------------------------------------
// 2. Build

function build(cwd) {
  const result = spawnSync('npx', ['ng', 'build', '--configuration', 'development'], {
    cwd,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: process.platform === 'win32',
    env: { ...process.env, NG_CLI_ANALYTICS: 'false' },
  });
  if (result.status !== 0) throw new Error(`ng build failed in ${cwd}`);
}

function readRoutes() {
  const source = readFileSync(join(ROOT, 'src', 'app', 'app.routes.ts'), 'utf8');
  const paths = [...source.matchAll(/path:\s*'([^']*)'/g)].map((m) => m[1]);
  return [...new Set(paths)].filter((p) => !p.includes(':') && p !== '**');
}

// -------------------------------------------------------------------------------------------------
// 3. Serve + Chrome

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.png': 'image/png', '.json': 'application/json' };

function serve(dir) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = join(dir, path);
      if (!existsSync(file) || statSync(file).isDirectory()) file = join(dir, 'index.html'); // SPA fallback
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(readFileSync(file));
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({ url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() });
    });
  });
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const found = candidates.find((c) => existsSync(c));
  if (!found) throw new Error('No Chrome/Edge found — set CHROME_PATH.');
  return found;
}

async function launchChrome() {
  const proc = spawn(findChrome(), [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${join(WORK, 'chrome-profile')}`,
    '--window-size=1280,900',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    'about:blank',
  ]);
  const wsUrl = await new Promise((resolve, reject) => {
    let buffer = '';
    proc.stderr.on('data', (chunk) => {
      buffer += chunk;
      const m = /DevTools listening on (ws:\/\/\S+)/.exec(buffer);
      if (m) resolve(m[1]);
    });
    proc.on('exit', () => reject(new Error(`Chrome exited early:\n${buffer}`)));
  });
  const port = new URL(wsUrl).port;
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-color-scheme', value: 'light' }] });
  return {
    cdp,
    close: () => {
      cdp.close();
      // Chrome spawns helper processes that outlive the main one on Windows; take the whole tree.
      if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(proc.pid), '/T', '/F'], { stdio: 'ignore' });
      else proc.kill();
    },
  };
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    let nextId = 1;
    const pending = new Map();
    const listeners = new Set();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
      } else if (msg.method) {
        for (const l of listeners) l(msg);
      }
    };
    ws.onerror = reject;
    ws.onopen = () =>
      resolve({
        send: (method, params = {}) =>
          new Promise((res, rej) => {
            const id = nextId++;
            pending.set(id, { res, rej });
            ws.send(JSON.stringify({ id, method, params }));
          }),
        on: (listener) => listeners.add(listener),
        off: (listener) => listeners.delete(listener),
        close: () => ws.close(),
      });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Computed styles of `root` and its descendants (and their ::before/::after), one line per element. */
const SIGNATURE = (rootSelector) => `(() => {
  const PROPS = ['display','position','top','right','bottom','left','width','height','margin-top','margin-right','margin-bottom',
    'margin-left','padding-top','padding-right','padding-bottom','padding-left','color','background-color','border-top-width',
    'border-right-width','border-bottom-width','border-left-width','border-top-style','border-top-color','border-left-color',
    'border-top-left-radius','border-bottom-right-radius','font-size','font-weight','line-height','letter-spacing','opacity',
    'visibility','box-shadow','outline-style','outline-width','outline-color','outline-offset','z-index','flex-direction',
    'flex-wrap','align-items','justify-content','row-gap','column-gap','overflow-x','overflow-y','text-align','white-space',
    'text-decoration-line','cursor','transform','translate','rotate','pointer-events','user-select','content'];
  const root = document.querySelector(${JSON.stringify(rootSelector)});
  if (!root) return null;
  const line = (el, pseudo) => {
    const cs = getComputedStyle(el, pseudo);
    return el.tagName.toLowerCase() + (pseudo ?? '') + ' ' + PROPS.map((p) => p + ':' + cs.getPropertyValue(p)).join(';');
  };
  const out = [];
  for (const el of [root, ...root.querySelectorAll('*')]) {
    out.push(line(el));
    for (const pseudo of ['::before', '::after']) {
      if (getComputedStyle(el, pseudo).content !== 'none') out.push(line(el, pseudo));
    }
  }
  return out;
})()`;

const FREEZE = `(() => {
  const style = document.createElement('style');
  style.textContent = '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }';
  document.head.append(style);
})()`;

const IMAGES_SETTLED = `Promise.all([...document.images].map((img) => img.complete ? null : new Promise((resolve) => {
  img.addEventListener('load', resolve, { once: true });
  img.addEventListener('error', resolve, { once: true });
  setTimeout(resolve, 8000);
}))).then(() => new Promise((resolve) => setTimeout(() => resolve(true), 100)))`;

/** Opens the first thing on the page that looks like an overlay trigger. */
const OPEN_OVERLAY = `(() => {
  const main = document.querySelector('main') ?? document.body;
  const byText = [...main.querySelectorAll('button')].find((b) => /\\b(open|show)\\b/i.test(b.textContent));
  const trigger = main.querySelector('[aria-haspopup]') ?? byText;
  if (!trigger) return false;
  trigger.focus();
  trigger.click();
  trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  return true;
})()`;

async function evaluate(cdp, expression) {
  const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (exceptionDetails) throw new Error(exceptionDetails.text);
  return result.value;
}

async function capture({ cdp }, url, shotName) {
  const errors = [];
  const onEvent = (msg) => {
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') errors.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
  };
  cdp.on(onEvent);
  const loaded = new Promise((resolve) => {
    const l = (msg) => {
      if (msg.method === 'Page.loadEventFired') {
        cdp.off(l);
        resolve();
      }
    };
    cdp.on(l);
  });
  await cdp.send('Page.navigate', { url });
  await loaded;
  // Lazy route chunk + fonts.
  for (let i = 0; i < 50 && !(await evaluate(cdp, `!!document.querySelector('main h1, main *')`)); i++) await sleep(100);
  await evaluate(cdp, 'document.fonts.ready.then(() => true)');
  // Remote images (the avatar demos) swap in a fallback on error — wait until each has settled.
  await evaluate(cdp, IMAGES_SETTLED);
  await evaluate(cdp, FREEZE);
  await sleep(300);

  const page = await evaluate(cdp, SIGNATURE('body'));
  await screenshot(cdp, shotName);

  let overlay = null;
  if (await evaluate(cdp, OPEN_OVERLAY)) {
    await sleep(400);
    overlay = await evaluate(cdp, SIGNATURE('.cdk-overlay-container')) ?? (await evaluate(cdp, SIGNATURE('body')));
    await screenshot(cdp, `${shotName}-overlay`);
  }
  cdp.off(onEvent);
  return { page, overlay, errors };
}

async function screenshot(cdp, name) {
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
  const file = join(WORK, 'screenshots', `${name}.png`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, Buffer.from(data, 'base64'));
}

function compare(label, a, b) {
  if (!a && !b) return [];
  if (!a || !b) return [`${label}: rendered in only one build`];
  if (a.length !== b.length) return [`${label}: ${a.length} vs ${b.length} elements`];
  const problems = [];
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    const pa = Object.fromEntries(a[i].split(';').map((kv) => kv.split(/:(.*)/s).slice(0, 2)));
    const pb = Object.fromEntries(b[i].split(';').map((kv) => kv.split(/:(.*)/s).slice(0, 2)));
    const diff = Object.keys(pa).filter((k) => pa[k] !== pb[k]).map((k) => `${k}: ${pa[k]} → ${pb[k]}`);
    problems.push(`${label} #${i} ${a[i].split(' ')[0]}: ${diff.slice(0, 4).join(', ')}`);
  }
  return problems.length ? [`${problems.length} element(s) differ`, ...problems] : [];
}

function slug(route) {
  return route === '' ? 'home' : route.replace(/\//g, '__');
}
