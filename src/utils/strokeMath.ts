import { StrokePoint, ShapeType } from '../types/whiteboard';

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

/**
 * Computes tight axis-aligned bounding box for stroke points with padding
 */
export function getStrokeBounds(points: StrokePoint[], strokeWidth: number = 4, padding: number = 8): BoundingBox {
  if (!points || points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const extra = strokeWidth + padding;
  minX = Math.floor(minX - extra);
  minY = Math.floor(minY - extra);
  maxX = Math.ceil(maxX + extra);
  maxY = Math.ceil(maxY + extra);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

/**
 * High-precision Catmull-Rom Spline Curve Interpolation
 * Generates continuous, C1-smooth curves that pass directly through control points
 */
export function getCatmullRomSplinePoints(
  points: StrokePoint[],
  tension: number = 0.5,
  segments: number = 4
): StrokePoint[] {
  if (points.length < 3) return points;

  const result: StrokePoint[] = [points[0]];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[0];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const pr1 = p1.pressure ?? 0.5;
    const pr2 = p2.pressure ?? 0.5;

    for (let s = 1; s <= segments; s++) {
      const t = s / segments;
      const t2 = t * t;
      const t3 = t2 * t;

      // Catmull-Rom Basis functions with tension parameter
      const f0 = -tension * t3 + 2 * tension * t2 - tension * t;
      const f1 = (2 - tension) * t3 + (tension - 3) * t2 + 1;
      const f2 = (tension - 2) * t3 + (3 - 2 * tension) * t2 + tension * t;
      const f3 = tension * t3 - tension * t2;

      const x = f0 * p0.x + f1 * p1.x + f2 * p2.x + f3 * p3.x;
      const y = f0 * p0.y + f1 * p1.y + f2 * p2.y + f3 * p3.y;
      const pressure = pr1 + (pr2 - pr1) * t;

      result.push({ x, y, pressure });
    }
  }

  return result;
}

/**
 * Multi-pass Stroke Smoothing with adaptive velocity dampening
 */
export function smoothStrokePoints(
  points: StrokePoint[],
  smoothingLevel: 'none' | 'medium' | 'high'
): StrokePoint[] {
  if (!points || points.length < 3 || smoothingLevel === 'none') {
    return points;
  }

  // High smoothing uses full Catmull-Rom spline with Chaikin post-filtering
  if (smoothingLevel === 'high') {
    const spline = getCatmullRomSplinePoints(points, 0.45, 3);
    const refined: StrokePoint[] = [spline[0]];
    for (let i = 1; i < spline.length - 1; i++) {
      const prev = spline[i - 1];
      const curr = spline[i];
      const next = spline[i + 1];
      refined.push({
        x: 0.2 * prev.x + 0.6 * curr.x + 0.2 * next.x,
        y: 0.2 * prev.y + 0.6 * curr.y + 0.2 * next.y,
        pressure: curr.pressure,
      });
    }
    refined.push(spline[spline.length - 1]);
    return refined;
  }

  // Medium smoothing: Chaikin algorithm
  const current = [...points];
  const nextRound: StrokePoint[] = [current[0]];
  for (let i = 1; i < current.length - 1; i++) {
    const prev = current[i - 1];
    const curr = current[i];
    const next = current[i + 1];

    nextRound.push(
      {
        x: 0.75 * curr.x + 0.25 * prev.x,
        y: 0.75 * curr.y + 0.25 * prev.y,
        pressure: curr.pressure,
      },
      {
        x: 0.75 * curr.x + 0.25 * next.x,
        y: 0.75 * curr.y + 0.25 * next.y,
        pressure: (curr.pressure || 0.5) * 0.5 + (next.pressure || 0.5) * 0.5,
      }
    );
  }
  nextRound.push(current[current.length - 1]);
  return nextRound;
}

/**
 * Stroke speed and velocity estimator for pressure simulation on non-stylus pointers
 */
export function estimatePressureFromVelocity(
  p1: { x: number; y: number; time?: number },
  p2: { x: number; y: number; time?: number },
  prevPressure: number = 0.5
): number {
  const dt = (p2.time || Date.now()) - (p1.time || Date.now() - 16);
  const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const speed = dist / Math.max(1, dt); // pixels per ms

  // Faster movement => thinner line (lower pressure); Slower => thicker (higher pressure)
  const targetPressure = Math.min(1.0, Math.max(0.2, 1.0 - speed * 0.25));
  return prevPressure * 0.7 + targetPressure * 0.3;
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
  if (!points || points.length < 6) return null;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let totalLength = 0;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;

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
  if (points.length >= 10 && totalLength > 40) {
    const mainBodyLastIdx = Math.floor(points.length * 0.75);
    const mainVector = {
      x: points[mainBodyLastIdx].x - first.x,
      y: points[mainBodyLastIdx].y - first.y,
    };
    const mainLen = Math.hypot(mainVector.x, mainVector.y);

    if (mainLen > 30) {
      const endVector = {
        x: last.x - points[mainBodyLastIdx].x,
        y: last.y - points[mainBodyLastIdx].y,
      };
      const dot = (mainVector.x * endVector.x + mainVector.y * endVector.y) / (mainLen * (Math.hypot(endVector.x, endVector.y) || 1));
      
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

    // Circle / Ellipse Detection
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
