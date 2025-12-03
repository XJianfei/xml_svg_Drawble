import React, { useState, useEffect } from 'react';
import { parseVectorXml } from './utils/parser';
import VectorCanvas from './components/VectorCanvas';
import InfoPanel from './components/InfoPanel';
import { VectorData } from './types';

// Default example from the prompt
const DEFAULT_XML = `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="200dp"
    android:height="200dp"
    android:viewportWidth="1024"
    android:viewportHeight="1024">
  <path
      android:pathData="M512,62C264.5,62 62,264.5 62,512s202.5,450 450,450c247.5,0 450,-202.5 450,-450S759.5,62 512,62zM512,887C302,887 137,722 137,512S302,137 512,137 887,302 887,512 722,887 512,887zM699.5,324.5c-15,-15 -37.5,-15 -52.5,-0L512,459.5l-135,-135c-15,-15 -37.5,-15 -52.5,-0 -15,15 -15,37.5 0,52.5L459.5,512l-135,135c-15,15 -15,37.5 -0,52.5 15,15 37.5,15 52.5,0L512,564.5l135,135c15,15 37.5,15 52.5,0s15,-37.5 0,-52.5L564.5,512l135,-135C714.5,362 714.5,339.5 699.5,324.5z"
      android:fillColor="#272636"/>
</vector>`;

const App: React.FC = () => {
  const [xmlInput, setXmlInput] = useState<string>(DEFAULT_XML);
  const [parsedData, setParsedData] = useState<VectorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const result = parseVectorXml(xmlInput);
    if (result.success && result.data) {
      setParsedData(result.data);
      setError(null);
    } else {
      setParsedData(null);
      setError(result.error || 'Unknown error');
    }
  }, [xmlInput]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-800">Android Vector Drawable Parser</h1>
          <p className="text-slate-500 mt-2">
            Regex-based parser to render Android XML vectors on HTML Canvas.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Input */}
          <section className="flex flex-col gap-4 h-full">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <label htmlFor="xmlInput" className="block text-sm font-semibold text-slate-700 mb-2">
                XML Input
              </label>
              <textarea
                id="xmlInput"
                value={xmlInput}
                onChange={(e) => setXmlInput(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
                placeholder="Paste <vector> XML content here..."
                spellCheck={false}
              />
              <div className="mt-2 text-xs text-slate-400 text-right">
                Modify the XML above to see real-time updates.
              </div>
            </div>

            {error && (
               <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700" role="alert">
                <p className="font-bold">Parsing Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </section>

          {/* Right Column: Preview */}
          <section className="flex flex-col gap-6">
            
            {/* Visual Rendering Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center">
              <h2 className="text-lg font-semibold text-slate-800 mb-6 w-full text-left border-b pb-2">
                Canvas Preview (100x100)
              </h2>
              
              <div className="relative group">
                <div className="border-2 border-gray-200 shadow-inner bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 rounded">
                  {/* The core requirement: 100x100 canvas rendering */}
                  <VectorCanvas data={parsedData || undefined} targetSize={100} />
                </div>
                
                {/* Tooltip hint */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Actual Size: 100x100px
                </div>
              </div>

               {parsedData && (
                <div className="mt-6 w-full text-xs text-center text-slate-400">
                  Rendering viewport {parsedData.viewportWidth}x{parsedData.viewportHeight} scaled to 100x100
                </div>
              )}
            </div>

            {/* Parsed Data Details */}
            {parsedData && <InfoPanel data={parsedData} />}

          </section>
        </div>
      </div>
    </div>
  );
};

export default App;