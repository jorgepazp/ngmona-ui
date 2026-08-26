export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export declare function parseSeed(input: string): Oklch;

export declare const RAMP_STEPS: readonly number[];
export declare function generateRamp(seed: Oklch): Record<number, Oklch>;

export declare function formatOklch(oklch: Oklch, alpha?: number): string;

export type SemanticMapEntry = { scale: string; step: number; alpha?: number } | { literal: string };
export declare const SEMANTIC_MAP: Record<string, SemanticMapEntry>;
export declare function resolveSemanticLayer(ramps: Record<string, Record<number, Oklch>>): Record<string, string>;

export declare const ROLES: readonly string[];

export interface Theme {
  ramps: Record<string, Record<number, Oklch>>;
  semantic: Record<string, string>;
}
export declare function buildTheme(seeds: Record<string, string>): Theme;

export declare function renderThemeColorsBlock(theme: Theme, roles: readonly string[], regenerateHint?: string): string;
