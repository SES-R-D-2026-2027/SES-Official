// On/off switches for playful extras. Flip a flag to false to disable an interaction site-wide.
export const features = {
  draggableStickers: true,
  flipTeamCards: true,
  eventCountdown: true,
  terminalEasterEgg: false,
  confettiOnJoin: true,
} as const;

export type FeatureFlag = keyof typeof features;

export function isEnabled(flag: FeatureFlag): boolean {
  return features[flag];
}
