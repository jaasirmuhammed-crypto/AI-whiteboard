import { StrokePoint, ShapeType } from '../types/whiteboard';

/**
 * Catmull-Rom or Quadratic interpolation for silky smooth stroke rendering
 */
export function smoothStrokePoints(points: StrokePoint[], smoothingLevel: 'none' | 'medium' | 'high'): StrokePoint[] {
  if (points.length < 3 || smoothingLevel === 'none') {
    return points;
  }

  const smoothed: StrokePoint[] = [];
  smoothed.push(points[0]);

  const iterations = smoothingLevel === 'high' ? 2 : 1;

  let current = [...points];

  for (let it = 0; it < iterations; it++) {
    const nextRound: StrokePoint[] = [current[0]];
    for (let i = 1; i < current.length - 1; i++) {
      const prev = current[i - 1];
      const curr = current[i];
      const next = current[i + 1];

      // Moving average / Chaikin smoothing
      const p1: StrokePoint = {
        x: 0.75 * curr.x + 0.25 * prev.x,
        y: 0.75 * curr.y + 0.25 * prev.y,
        pressure: curr.pressure,
      };
      const p2: StrokePoint = {
        x: 0.75 * curr.x + 0.25 * next.x,
        y: 0.75 * curr.y + 0.25 * next.y,
        pressure: (curr.pressure || 0.5) * 0.5 + (next.pressure || 0.5) * 0.5,
      };
      nextRound.push(p1, p2);
    }
    nextRound.push(current[current.length - 1]);
    current = nextRound;
  }

  return current;
}

/**
 * Intelligent Smart Shape Recognition
 * Detects if a hand-drawn stroke is intended as a circle, rectangle, triangle, arrow, or straight line.
 */
export function detectSmartShape(points: StrokePoint[]): {
  detected: boolean;
  shapeType?: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
} | null {
  if (points.length < 8) return null;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let totalLength = 0;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);

    if (i > 0) {
      const prev = points[i - 1];
      totalLength += Math.hypot(p.x - prev.x, p.y - prev.y);
    }
  }

  const width = Math.max(maxX - minX, 10);
  const height = Math.max(maxY - minY, 10);
  const first = points[0];
  const last = points[points.length - 1];
  const startEndDist = Math.hypot(last.x - first.x, last.y - first.y);

  // 1. Straight Line Check
  const directDistance = Math.hypot(last.x - first.x, last.y - first.y);
  if (totalLength > 40 && directDistance / totalLength > 0.92) {
    return {
      detected: true,
      shapeType: 'line',
      x: first.x,
      y: first.y,
      width: last.x - first.x,
      height: last.y - first.y,
      confidence: 0.95,
    };
  }

  // 2. Closed Loop Check (Circle or Rectangle or Triangle)
  const isClosed = startEndDist < Math.max(width, height) * 0.35 || startEndDist < 35;

  if (isClosed && totalLength > 60) {
    const perimeter = 2 * (width + height);
    const circlePerimeter = Math.PI * ((width + height) / 2);
    const aspectRatio = Math.min(width, height) / Math.max(width, height);

    // If roughly 1:1 aspect ratio and perimeter matches circle
    if (aspectRatio > 0.65 && Math.abs(totalLength - circlePerimeter) / circlePerimeter < 0.35) {
      return {
        detected: true,
        shapeType: 'circle',
        x: minX,
        y: minY,
        width,
        height,
        confidence: 0.91,
      };
    }

    // Check if Rectangle
    if (Math.abs(totalLength - perimeter) / perimeter < 0.4) {
      return {
        detected: true,
        shapeType: 'rectangle',
        x: minX,
        y: minY,
        width,
        height,
        confidence: 0.88,
      };
    }

    // Otherwise check Triangle
    return {
      detected: true,
      shapeType: 'triangle',
      x: minX,
      y: minY,
      width,
      height,
      confidence: 0.82,
    };
  }

  return null;
}
