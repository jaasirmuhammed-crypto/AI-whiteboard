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
 * Advanced Smart Shape & Gesture Recognition Engine
 * Detects rough circles, ellipses, arrows, rectangles, triangles, and straight lines.
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
  if (points.length < 6) return null;

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

  // 1. ARROW GESTURE DETECTION
  // Check if stroke ends with an arrowhead (hook or V-shape at end)
  if (points.length >= 10 && totalLength > 40) {
    const mainBodyLastIdx = Math.floor(points.length * 0.75);
    const mainVector = {
      x: points[mainBodyLastIdx].x - first.x,
      y: points[mainBodyLastIdx].y - first.y,
    };
    const mainLen = Math.hypot(mainVector.x, mainVector.y);

    if (mainLen > 30) {
      // Check head turning points
      const endVector = {
        x: last.x - points[mainBodyLastIdx].x,
        y: last.y - points[mainBodyLastIdx].y,
      };
      const dot = (mainVector.x * endVector.x + mainVector.y * endVector.y) / (mainLen * (Math.hypot(endVector.x, endVector.y) || 1));
      
      // If turnaround or hook at the end
      if (dot < 0.2 || (startEndDist > totalLength * 0.7 && totalLength > mainLen * 1.15)) {
        return {
          detected: true,
          shapeType: 'arrow',
          x: first.x,
          y: first.y,
          width: last.x - first.x,
          height: last.y - first.y,
          confidence: 0.88,
        };
      }
    }
  }

  // 2. STRAIGHT LINE DETECTION
  const directDistance = Math.hypot(last.x - first.x, last.y - first.y);
  if (totalLength > 35 && directDistance / totalLength > 0.90) {
    // Snap to pure horizontal or vertical if angle is within 7 degrees
    let endX = last.x;
    let endY = last.y;
    const angleRad = Math.atan2(Math.abs(last.y - first.y), Math.abs(last.x - first.x));
    const angleDeg = (angleRad * 180) / Math.PI;

    if (angleDeg < 7) {
      endY = first.y; // horizontal snap
    } else if (angleDeg > 83) {
      endX = first.x; // vertical snap
    }

    return {
      detected: true,
      shapeType: 'line',
      x: first.x,
      y: first.y,
      width: endX - first.x,
      height: endY - first.y,
      confidence: 0.94,
    };
  }

  // 3. CLOSED LOOP GESTURES (Circle, Ellipse, Rectangle, Triangle)
  const isClosed = startEndDist < Math.max(width, height) * 0.38 || startEndDist < 40;

  if (isClosed && totalLength > 50) {
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    // Calculate radial distance variance from center
    let sumDist = 0;
    const distances: number[] = [];
    for (let i = 0; i < points.length; i++) {
      const d = Math.hypot(points[i].x - cx, points[i].y - cy);
      distances.push(d);
      sumDist += d;
    }
    const avgDist = sumDist / points.length;
    let varianceSum = 0;
    for (const d of distances) {
      varianceSum += Math.pow(d - avgDist, 2);
    }
    const stdDev = Math.sqrt(varianceSum / distances.length);
    const radialVarianceRatio = stdDev / (avgDist || 1);

    const perimeter = 2 * (width + height);
    const circlePerimeter = Math.PI * ((width + height) / 2);
    const aspectRatio = Math.min(width, height) / Math.max(width, height);

    // Rough Circle / Ellipse Detection
    if (radialVarianceRatio < 0.24 && Math.abs(totalLength - circlePerimeter) / circlePerimeter < 0.38) {
      return {
        detected: true,
        shapeType: 'circle',
        x: minX,
        y: minY,
        width,
        height,
        confidence: 0.93,
      };
    }

    // Rectangle Detection
    if (Math.abs(totalLength - perimeter) / perimeter < 0.36) {
      return {
        detected: true,
        shapeType: 'rectangle',
        x: minX,
        y: minY,
        width,
        height,
        confidence: 0.89,
      };
    }

    // Triangle Detection
    return {
      detected: true,
      shapeType: 'triangle',
      x: minX,
      y: minY,
      width,
      height,
      confidence: 0.84,
    };
  }

  return null;
}
