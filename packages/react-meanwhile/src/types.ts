export type ShapeType = 'text' | 'rect' | 'circle';

export interface Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ShapeType;
}

export type ShapeDescriptor = Shape[];

export interface CachedMeasurement {
  shapes: ShapeDescriptor;
  width: number;
  height: number;
}
