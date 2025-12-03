import React, { useEffect, useRef } from 'react';
import { VectorData } from '../types';

interface VectorCanvasProps {
  data: VectorData | undefined;
  targetSize: number; // e.g., 100 for 100x100
}

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
    // We want the viewport coordinate system to fit into the targetSize (100px)
    // Scale X = Target Width / Viewport Width
    const scaleX = targetSize / data.viewportWidth;
    const scaleY = targetSize / data.viewportHeight;

    // Use save/restore to ensure state doesn't bleed between renders if we had animations
    ctx.save();
    
    // Apply the scaling. 
    // Now, any drawing command using viewport coordinates will be scaled down/up to the canvas size.
    ctx.scale(scaleX, scaleY);

    // Draw Paths
    data.paths.forEach((path) => {
      try {
        // Path2D parses SVG path data strings natively
        const p2d = new Path2D(path.pathData);
        
        ctx.fillStyle = path.fillColor;
        ctx.fill(p2d);
        
        // Optional: Support stroke if extracted (omitted for this specific requirement but good practice)
        // if (path.strokeColor) {
        //   ctx.strokeStyle = path.strokeColor;
        //   ctx.lineWidth = path.strokeWidth || 1;
        //   ctx.stroke(p2d);
        // }
      } catch (err) {
        console.error("Failed to draw path:", path.pathData, err);
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