export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export declare const RAMP_STEPS: readonly number[];
export declare function generateRamp(seed: Oklch): Record<number, Oklch>;
