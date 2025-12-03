import { VectorData, PathElement, ParseResult } from '../types';

/**
 * Android hex colors often come as #AARRGGBB.
 * CSS expects #RRGGBBAA.
 * This helper converts Android format to CSS format if necessary.
 */
const normalizeColor = (hex: string | undefined): string => {
  if (!hex) return '#000000'; // Default to black
  
  // Remove starting '@' or specific resource references if strictly simple hex
  if (!hex.startsWith('#')) return '#000000';

  const cleanHex = hex.replace('#', '');
  
  // Handle #AARRGGBB -> #RRGGBBAA
  if (cleanHex.length === 8) {
    const alpha = cleanHex.substring(0, 2);
    const rgb = cleanHex.substring(2);
    return `#${rgb}${alpha}`;
  }
  
  return hex;
};

export const parseVectorXml = (xml: string): ParseResult => {
  try {
    if (!xml || !xml.trim()) {
      return { success: false, error: 'Empty input' };
    }

    // 1. Extract Root Attributes using Regex
    // Look for android:viewportWidth="..."
    const vpWMatch = xml.match(/android:viewportWidth\s*=\s*"([^"]+)"/);
    const vpHMatch = xml.match(/android:viewportHeight\s*=\s*"([^"]+)"/);
    
    // Look for android:width="..." (might contain 'dp')
    const wMatch = xml.match(/android:width\s*=\s*"([^"]+)"/);
    const hMatch = xml.match(/android:height\s*=\s*"([^"]+)"/);

    if (!vpWMatch || !vpHMatch) {
      return { 
        success: false, 
        error: 'Could not find android:viewportWidth or android:viewportHeight attributes.' 
      };
    }

    const viewportWidth = parseFloat(vpWMatch[1]);
    const viewportHeight = parseFloat(vpHMatch[1]);
    
    // Parse width/height, stripping 'dp' if present
    const width = wMatch ? parseFloat(wMatch[1].replace('dp', '')) : 100;
    const height = hMatch ? parseFloat(hMatch[1].replace('dp', '')) : 100;

    // 2. Extract Paths
    // We match all <path ... /> tags. 
    // Note: This regex assumes standard formatting. It captures the entire tag content.
    const pathTagRegex = /<path([^>]+)\/>/g;
    const paths: PathElement[] = [];

    let match;
    while ((match = pathTagRegex.exec(xml)) !== null) {
      const tagContent = match[1];

      // Inside the path tag, find pathData and fillColor
      const pathDataMatch = tagContent.match(/android:pathData\s*=\s*"([^"]+)"/);
      const fillColorMatch = tagContent.match(/android:fillColor\s*=\s*"([^"]+)"/);
      
      if (pathDataMatch) {
        paths.push({
          pathData: pathDataMatch[1],
          fillColor: normalizeColor(fillColorMatch ? fillColorMatch[1] : undefined)
        });
      }
    }

    if (paths.length === 0) {
       return { success: false, error: 'No <path> elements with android:pathData found.' };
    }

    const data: VectorData = {
      width,
      height,
      viewportWidth,
      viewportHeight,
      paths
    };

    return { success: true, data };

  } catch (e: any) {
    return { success: false, error: e.message || 'Unknown parsing error' };
  }
};