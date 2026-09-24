import type { Shape, ShapeDescriptor, ShapeType } from '../../types';

const CIRCLE_ASPECT_TOLERANCE = 0.2;
const CIRCLE_RADIUS_THRESHOLD = 0.4;

function hasOwnText(el: Element): boolean {
  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE && (child.textContent ?? '').trim()) {
      return true;
    }
  }
  return false;
}

function isLeaf(el: Element): boolean {
  for (const child of el.children) {
    if (child instanceof HTMLElement || child instanceof SVGElement) {
      return false;
    }
  }
  return true;
}

function classify(el: Element, rect: DOMRect): ShapeType {
  if (hasOwnText(el)) {
    return 'text';
  }

  const style = window.getComputedStyle(el);
  const borderRadius = parseFloat(style.borderRadius) || 0;
  const maxSide = Math.max(rect.width, rect.height);
  const isSquarish =
    maxSide > 0 && Math.abs(rect.width - rect.height) < maxSide * CIRCLE_ASPECT_TOLERANCE;

  if (isSquarish && borderRadius >= maxSide * CIRCLE_RADIUS_THRESHOLD) {
    return 'circle';
  }

  return 'rect';
}

function textBarHeight(el: Element, rect: DOMRect): number {
  const style = window.getComputedStyle(el);
  const lineHeight = parseFloat(style.lineHeight);
  if (!Number.isNaN(lineHeight) && lineHeight > 0) {
    return Math.round(lineHeight);
  }
  return Math.round(rect.height);
}

export interface ContainerMeasurement {
  shape: ShapeDescriptor;
  bounds: { width: number; height: number };
}

/**
 * Measures a rendered container. `shape` is a flat descriptor for every leaf
 * element (text bars, rects, circles) positioned relative to the container's
 * top-left corner; `bounds` is the container's own bounding box, read
 * directly rather than derived from the leaves.
 */
export function measureContainer(container: HTMLElement): ContainerMeasurement {
  const containerRect = container.getBoundingClientRect();
  const shapes: Shape[] = [];

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode() as Element | null;

  while (node) {
    if (isLeaf(node)) {
      const rect = node.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        const type = classify(node, rect);

        shapes.push({
          x: Math.round(rect.left - containerRect.left),
          y: Math.round(rect.top - containerRect.top),
          width: Math.round(rect.width),
          height: type === 'text' ? textBarHeight(node, rect) : Math.round(rect.height),
          type,
        });
      }
    }

    node = walker.nextNode() as Element | null;
  }

  return {
    shape: shapes,
    bounds: { width: containerRect.width, height: containerRect.height },
  };
}
