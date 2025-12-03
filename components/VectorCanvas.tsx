import React, { useEffect, useRef } from 'react';
import { VectorData } from '../types';

interface VectorCanvasProps {
  data: VectorData | undefined;
  targetSize: number;
}

/**
 * Converts Android Hex color (#AARRGGBB or #RRGGBB) + Alpha attribute
 * into a CSS rgba string.
 */
const getRgbaColor = (hex: string | undefined, alphaAttr: number = 1): string | undefined => {
  if (!hex) return undefined;
  
  let cleanHex = hex.replace('#', '');
  let r = 0, g = 0, b = 0, a = 1;

  if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else if (cleanHex.length === 8) {
    // Android is AARRGGBB
    const alphaHex = parseInt(cleanHex.substring(0, 2), 16);
    a = alphaHex / 255;
    r = parseInt(cleanHex.substring(2, 4), 16);
    g = parseInt(cleanHex.substring(4, 6), 16);
    b = parseInt(cleanHex.substring(6, 8), 16);
  } else {
    return hex; // Fallback for 3 digit or named colors
  }

  // Combine the alpha from the hex and the alpha from the attribute
  const finalAlpha = a * alphaAttr;

  return `rgba(${r}, ${g}, ${b}, ${finalAlpha.toFixed(3)})`;
};

const VectorCanvas: React.FC<VectorCanvasProps> = ({ data, targetSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate Scale
    const scaleX = targetSize / data.viewportWidth;
    const scaleY = targetSize / data.viewportHeight;

    ctx.save();
    ctx.scale(scaleX, scaleY);

    data.paths.forEach((path) => {
      try {
        const p2d = new Path2D(path.pathData);
        
        // Handle Fill
        if (path.fillColor) {
          const rgba = getRgbaColor(path.fillColor, path.fillAlpha);
          if (rgba) {
            ctx.fillStyle = rgba;
            // Use the specific fill rule (nonzero or evenodd)
            ctx.fill(p2d, path.fillType || 'nonzero');
          }
        }

        // Handle Stroke
        if (path.strokeWidth && path.strokeWidth > 0 && path.strokeColor) {
          const rgba = getRgbaColor(path.strokeColor, path.strokeAlpha);
          if (rgba) {
            ctx.strokeStyle = rgba;
            ctx.lineWidth = path.strokeWidth;
            ctx.stroke(p2d);
          }
        }
      } catch (err) {
        console.warn("Failed to render path:", path.pathData);
      }
    });

    ctx.restore();

  }, [data, targetSize]);

  if (!data) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-200 text-gray-400 rounded-lg border-2 border-dashed border-gray-300"
        style={{ width: targetSize, height: targetSize }}
      >
        <span className="text-xs">No Data</span>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={targetSize}
      height={targetSize}
      className="bg-transparent border border-gray-200 rounded shadow-sm checkerboard-bg"
      title={`Rendered at ${targetSize}x${targetSize}`}
    />
  );
};

export default VectorCanvas;