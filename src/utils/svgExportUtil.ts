import { WhiteboardElement, StrokeElement, ShapeElement, TextElement, StickyElement } from '../types/whiteboard';

/**
 * High-Precision SVG Vectorizer for AI Whiteboard
 * Converts handwritten strokes, geometric shapes, sticky notes, and text into clean, optimized SVG vector paths.
 */
export function elementsToSVG(elements: WhiteboardElement[], width: number = 1920, height: number = 1080): string {
  if (!elements || elements.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"></svg>`;
  }

  // Calculate bounding box encompassing all elements with padding
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  elements.forEach((el) => {
    if (el.type === 'stroke') {
      const stroke = el as StrokeElement;
      stroke.points.forEach((p) => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      });
    } else if (el.type === 'shape' || el.type === 'sticky') {
      const shape = el as ShapeElement | StickyElement;
      minX = Math.min(minX, shape.x);
      minY = Math.min(minY, shape.y);
      maxX = Math.max(maxX, shape.x + (shape.width || 100));
      maxY = Math.max(maxY, shape.y + (shape.height || 100));
    } else if (el.type === 'text') {
      const text = el as TextElement;
      minX = Math.min(minX, text.x);
      minY = Math.min(minY, text.y - (text.fontSize || 18));
      maxX = Math.max(maxX, text.x + (text.text.length * (text.fontSize || 18) * 0.65));
      maxY = Math.max(maxY, text.y + 10);
    }
  });

  if (!isFinite(minX) || !isFinite(minY)) {
    minX = 0; minY = 0; maxX = width; maxY = height;
  }

  const padding = 40;
  const vbX = Math.max(0, Math.floor(minX - padding));
  const vbY = Math.max(0, Math.floor(minY - padding));
  const vbW = Math.max(width, Math.ceil(maxX - minX + padding * 2));
  const vbH = Math.max(height, Math.ceil(maxY - minY + padding * 2));

  const svgParts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${vbW} ${vbH}" width="${vbW}" height="${vbH}">`,
    `  <defs>`,
    `    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">`,
    `      <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />`,
    `    </marker>`,
    `  </defs>`,
  ];

  elements.forEach((el) => {
    if (el.type === 'stroke') {
      const stroke = el as StrokeElement;
      if (!stroke.points || stroke.points.length === 0) return;

      if (stroke.points.length === 1) {
        const p = stroke.points[0];
        const r = Math.max(1, stroke.width / 2);
        svgParts.push(`  <circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${r.toFixed(2)}" fill="${stroke.color}" opacity="${stroke.opacity || 1}" />`);
        return;
      }

      // Generate Smooth Quadratic Bezier Path
      let d = `M ${stroke.points[0].x.toFixed(2)} ${stroke.points[0].y.toFixed(2)}`;
      for (let i = 1; i < stroke.points.length - 1; i++) {
        const midX = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
        const midY = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
        d += ` Q ${stroke.points[i].x.toFixed(2)} ${stroke.points[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
      }
      const last = stroke.points[stroke.points.length - 1];
      const prev = stroke.points[stroke.points.length - 2];
      d += ` Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;

      const isHighlighter = stroke.tool === 'highlighter';
      const strokeW = isHighlighter ? stroke.width * 2.5 : stroke.width;
      const opacity = isHighlighter ? 0.35 : (stroke.opacity || 1);

      svgParts.push(`  <path d="${d}" fill="none" stroke="${stroke.color}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}" />`);
    } else if (el.type === 'shape') {
      const shape = el as ShapeElement;
      const opacity = shape.opacity || 1;
      const strokeW = shape.strokeWidth || 2;
      const fill = shape.fillColor || 'none';

      if (shape.shapeType === 'rectangle') {
        svgParts.push(`  <rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" rx="6" fill="${fill}" stroke="${shape.color}" stroke-width="${strokeW}" opacity="${opacity}" />`);
      } else if (shape.shapeType === 'circle') {
        const rx = Math.abs(shape.width / 2);
        const ry = Math.abs(shape.height / 2);
        const cx = shape.x + rx;
        const cy = shape.y + ry;
        svgParts.push(`  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${shape.color}" stroke-width="${strokeW}" opacity="${opacity}" />`);
      } else if (shape.shapeType === 'triangle') {
        const p1 = `${shape.x + shape.width / 2},${shape.y}`;
        const p2 = `${shape.x},${shape.y + shape.height}`;
        const p3 = `${shape.x + shape.width},${shape.y + shape.height}`;
        svgParts.push(`  <polygon points="${p1} ${p2} ${p3}" fill="${fill}" stroke="${shape.color}" stroke-width="${strokeW}" opacity="${opacity}" />`);
      } else if (shape.shapeType === 'arrow' || shape.shapeType === 'line') {
        const x2 = shape.x + shape.width;
        const y2 = shape.y + shape.height;
        const marker = shape.shapeType === 'arrow' ? ' marker-end="url(#arrowhead)"' : '';
        svgParts.push(`  <line x1="${shape.x}" y1="${shape.y}" x2="${x2}" y2="${y2}" stroke="${shape.color}" stroke-width="${strokeW}" opacity="${opacity}"${marker} stroke-linecap="round" />`);
      }
    } else if (el.type === 'sticky') {
      const sticky = el as StickyElement;
      const bg = sticky.color || '#fef3c7';
      svgParts.push(`  <g opacity="1">`);
      svgParts.push(`    <rect x="${sticky.x}" y="${sticky.y}" width="${sticky.width}" height="${sticky.height}" rx="12" fill="${bg}" stroke="#f59e0b" stroke-width="1.5" />`);
      svgParts.push(`    <text x="${sticky.x + 14}" y="${sticky.y + 24}" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#92400e">📌 ${sticky.title || 'Note'}</text>`);
      if (sticky.text) {
        svgParts.push(`    <text x="${sticky.x + 14}" y="${sticky.y + 48}" font-family="system-ui, sans-serif" font-size="12" fill="#1e293b">${escapeXml(sticky.text)}</text>`);
      }
      svgParts.push(`  </g>`);
    } else if (el.type === 'text') {
      const text = el as TextElement;
      const weight = text.bold ? 'bold' : 'normal';
      const style = text.italic ? 'italic' : 'normal';
      svgParts.push(`  <text x="${text.x}" y="${text.y}" font-family="${text.fontFamily || 'sans-serif'}" font-size="${text.fontSize || 18}" font-weight="${weight}" font-style="${style}" fill="${text.color}">${escapeXml(text.text)}</text>`);
    }
  });

  svgParts.push('</svg>');
  return svgParts.join('\n');
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
