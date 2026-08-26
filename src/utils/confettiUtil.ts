import confetti from 'canvas-confetti';

/**
 * Subtle, tasteful celebration micro-burst.
 * Kept fast, lightweight, and clean without blocking UI interaction.
 */
export const triggerSubtleConfetti = (originX: number = 0.5, originY: number = 0.6) => {
  try {
    confetti({
      particleCount: 36,
      spread: 60,
      startVelocity: 25,
      origin: { x: originX, y: originY },
      colors: ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ec4899'],
      ticks: 150,
      gravity: 1.1,
      scalar: 0.8,
      disableForReducedMotion: true,
    });
  } catch (e) {
    // Graceful fallback if canvas confetti is unavailable
  }
};

export const triggerStarBurst = (originX: number = 0.5, originY: number = 0.5) => {
  try {
    confetti({
      particleCount: 24,
      spread: 45,
      startVelocity: 20,
      origin: { x: originX, y: originY },
      shapes: ['circle'],
      colors: ['#f59e0b', '#fbbf24', '#6366f1'],
      ticks: 120,
      scalar: 0.7,
      disableForReducedMotion: true,
    });
  } catch (e) {
    // fallback
  }
};
