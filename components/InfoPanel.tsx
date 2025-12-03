import React from 'react';
import { VectorData } from '../types';

interface InfoPanelProps {
  data: VectorData;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
      <h3 className="font-semibold text-gray-700 border-b pb-2">Extracted Attributes</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="block text-gray-500 text-xs uppercase tracking-wider">Viewport Width</span>
          <span className="font-mono font-medium">{data.viewportWidth}</span>
        </div>
        <div>
          <span className="block text-gray-500 text-xs uppercase tracking-wider">Viewport Height</span>
          <span className="font-mono font-medium">{data.viewportHeight}</span>
        </div>
        <div>
          <span className="block text-gray-500 text-xs uppercase tracking-wider">Intrinsic Width</span>
          <span className="font-mono font-medium">{data.width}dp</span>
        </div>
        <div>
          <span className="block text-gray-500 text-xs uppercase tracking-wider">Intrinsic Height</span>
          <span className="font-mono font-medium">{data.height}dp</span>
        </div>
      </div>

      <div>
        <span className="block text-gray-500 text-xs uppercase tracking-wider mb-2">Paths Found: {data.paths.length}</span>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {data.paths.map((p, idx) => (
            <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-100 text-xs break-all">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-4 h-4 rounded border border-gray-300 shadow-sm"
                  style={{ backgroundColor: p.fillColor }} 
                  title={p.fillColor}
                />
                <code className="text-blue-600 font-bold">{p.fillColor}</code>
              </div>
              <code className="text-gray-600 block line-clamp-3 hover:line-clamp-none cursor-pointer" title="Click to expand path data">
                {p.pathData}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;