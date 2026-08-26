// Fallback seed colors used by `ngmona init`/`ngmona theme` when the user skips a role. Mirrors
// ui-kit's own scripts/theme.seeds.json (kept as an intentional small duplication — a consumer
// project has no access to that file, and 7 hex strings aren't worth wiring cross-package asset
// copying for).
export const DEFAULT_SEEDS = {
  primary: '#D5006C',
  accent: '#3B3CF7',
  danger: '#FF4B4B',
  info: '#007EFF',
  warning: '#FFC058',
  success: '#15CC96',
  neutral: '#7A828C',
};
