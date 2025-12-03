export interface PathElement {
  pathData: string;
  fillColor?: string;
  fillAlpha?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeAlpha?: number;
  fillType?: 'nonzero' | 'evenodd';
}

export interface VectorData {
  width: number; // The intrinsic width (dp)
  height: number; // The intrinsic height (dp)
  viewportWidth: number; // The coordinate system width
  viewportHeight: number; // The coordinate system height
  paths: PathElement[];
}

export interface ParseResult {
  success: boolean;
  data?: VectorData;
  error?: string;
}