import React, { useState, useEffect } from 'react';
import { parseVectorXml } from './utils/parser';
import VectorCanvas from './components/VectorCanvas';
import InfoPanel from './components/InfoPanel';
import { VectorData } from './types';

const DEFAULT_XML = `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:aapt="http://schemas.android.com/aapt"
    android:width="1267dp"
    android:height="1267dp"
    android:viewportWidth="1267"
    android:viewportHeight="1267">
  <group>
    <clip-path
        android:pathData="M0,0h1267v1267h-1267z"/>
    <path
        android:pathData="M59,60h1148v1148h-1148z"
        android:fillColor="#FFFFFF"
        android:fillAlpha="0"/>
    <path
        android:pathData="M269,60L997,60A210,210 0,0 1,1207 270L1207,998A210,210 0,0 1,997 1208L269,1208A210,210 0,0 1,59 998L59,270A210,210 0,0 1,269 60z">
      <aapt:attr name="android:fillColor">
        <gradient 
            android:startX="633"
            android:startY="60"
            android:endX="633"
            android:endY="1208"
            android:type="linear">
          <item android:offset="0" android:color="#FF1FA1FF"/>
          <item android:offset="1" android:color="#FF095CFF"/>
        </gradient>
      </aapt:attr>
    </path>
    <path
        android:pathData="M321,690m-117,0a117,117 0,1 1,234 0a117,117 0,1 1,-234 0"
        android:fillColor="#C5D3FF"/>
    <path
        android:pathData="M345.3,575.9L574.9,346.3A81,81 81.6,0 1,689.5 346.3L920.3,577.1A81,81 0,0 1,920.3 691.6L690.6,921.3A81,81 68.2,0 1,576.1 921.3L345.3,690.5A81,81 76.1,0 1,345.3 575.9z"
        android:fillColor="#FFFFFF"/>
    <path
        android:pathData="M511,494h244v280h-244z"
        android:fillColor="#FFFFFF"
        android:fillAlpha="0"/>
    <group>
      <clip-path
          android:pathData="M511,494h244v280h-244z"/>
      <path
          android:pathData="M716.7,713.6C717,714.2 717.5,714.3 717.9,714C718.3,713.7 718.4,713 718.2,712.5L647.8,567.2C644.7,560.7 641,556.8 636.8,555.3C635.6,554.9 634.3,554.7 633,554.7C631.7,554.7 630.4,554.9 629.2,555.3C625,556.8 621.3,560.7 618.2,567.2L547.8,712.5C547.6,713 547.7,713.7 548.1,714C548.5,714.3 549,714.2 549.3,713.6L619.7,568.4C622.6,562.3 626,558.6 630,557.3C630.9,557 632,556.9 633,556.9C634,556.9 635,557 636,557.3C639.9,558.6 642.8,562.3 645.8,568.4L716.7,713.6Z"
          android:fillColor="#449AFF"
          android:fillAlpha="0"
          android:fillType="evenOdd"/>
      <path
          android:pathData="M717.9,714C718.3,713.7 718.4,713 718.2,712.5L647.8,567.2C644.7,560.7 641,556.8 636.8,555.3C635.6,554.9 634.3,554.7 633,554.7C631.7,554.7 630.4,554.9 629.2,555.3C625,556.8 621.3,560.7 618.2,567.2L547.8,712.5C547.6,713 547.7,713.7 548.1,714C548.5,714.3 549,714.2 549.3,713.6L619.7,568.4C622.6,562.3 626,558.6 630,557.3C630.9,557 632,556.9 633,556.9C634,556.9 635,557 636,557.3C639.9,558.6 642.8,562.3 645.8,568.4L716.7,713.6C717,714.2 717.5,714.3 717.9,714Z"
          android:strokeWidth="65.000000"
          android:fillColor="#00000000">
        <aapt:attr name="android:strokeColor">
          <gradient 
              android:startX="633"
              android:startY="714.2"
              android:endX="633"
              android:endY="554.7"
              android:type="linear">
            <item android:offset="0" android:color="#FF449AFF"/>
            <item android:offset="1" android:color="#93449AFF"/>
          </gradient>
        </aapt:attr>
      </path>
    </group>
  </group>
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