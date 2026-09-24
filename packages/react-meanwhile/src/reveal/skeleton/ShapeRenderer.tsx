import type { ShapeDescriptor } from '../../types';

interface ShapeRendererProps {
  shapes: ShapeDescriptor;
  containerWidth: number;
  containerHeight: number;
}

export function ShapeRenderer({ shapes, containerWidth, containerHeight }: ShapeRendererProps) {
  return (
    <div
      className="rmw-skeleton-wrapper"
      style={{ width: containerWidth, height: containerHeight }}
      aria-busy="true"
      aria-live="polite"
    >
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`rmw-shape rmw-shape--${shape.type}`}
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.width,
            height: shape.height,
          }}
        />
      ))}
    </div>
  );
}
