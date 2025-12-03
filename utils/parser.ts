import { VectorData, PathElement, ParseResult } from '../types';

/**
 * Helper to extract an attribute value from a string block.
 * Matches android:name="value" taking newlines and spaces into account.
 */
const getAttr = (text: string, attrName: string): string | null => {
  // Regex explanation:
  // 1. Match the attribute name (e.g. android:pathData)
  // 2. Followed by =
  // 3. Followed by quotes (single or double)
  // 4. Capture the content inside quotes
  const regex = new RegExp(`${attrName}\\s*=\\s*["']([^"']+)["']`);
  const match = text.match(regex);
  return match ? match[1] : null;
};

/**
 * Helper to find the first color inside a gradient definition
 * Used as a fallback when the main path has a gradient but no solid color.
 */
const findFallbackGradientColor = (content: string): string | null => {
  // Look for <item ... android:color="..." /> inside the path's children
  const match = content.match(/android:color\s*=\s*"([^"]+)"/);
  return match ? match[1] : null;
};

export const parseVectorXml = (xml: string): ParseResult => {
  try {
    if (!xml || !xml.trim()) {
      return { success: false, error: 'Empty input' };
    }

    // 1. Extract Root Attributes
    const viewportWidthStr = getAttr(xml, 'android:viewportWidth');
    const viewportHeightStr = getAttr(xml, 'android:viewportHeight');
    const widthStr = getAttr(xml, 'android:width');
    const heightStr = getAttr(xml, 'android:height');

    if (!viewportWidthStr || !viewportHeightStr) {
      return { 
        success: false, 
        error: 'Could not find android:viewportWidth or android:viewportHeight attributes.' 
      };
    }

    const viewportWidth = parseFloat(viewportWidthStr);
    const viewportHeight = parseFloat(viewportHeightStr);
    const width = widthStr ? parseFloat(widthStr.replace('dp', '')) : 100;
    const height = heightStr ? parseFloat(heightStr.replace('dp', '')) : 100;

    // 2. Extract Paths using a Split Strategy
    // Splitting by '<path' allows us to iterate over every path tag, 
    // access its immediate attributes, and also see its children (for gradients) 
    // before the next path starts.
    const segments = xml.split(/<path\s+/);
    const paths: PathElement[] = [];

    // Start from 1 because the first segment is the header (before the first <path)
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];

      // The segment starts with the attributes of the path.
      // It ends (conceptually) at the start of the next <path (which is the split delimiter).
      // However, we need to separate the opening tag attributes from the children.
      // The opening tag ends at the first '>' or '/>'.
      const tagEndIndex = segment.search(/\/?>/);
      
      if (tagEndIndex === -1) continue; // Should not happen in valid XML

      const attributesBlock = segment.substring(0, tagEndIndex);
      const contentBlock = segment.substring(tagEndIndex); // Children and closing tags

      const pathData = getAttr(attributesBlock, 'android:pathData');
      
      // If no pathData, skip (could be malformed)
      if (!pathData) continue;

      let fillColor = getAttr(attributesBlock, 'android:fillColor');
      const fillAlphaStr = getAttr(attributesBlock, 'android:fillAlpha');
      const fillAlpha = fillAlphaStr ? parseFloat(fillAlphaStr) : 1.0;
      
      let strokeColor = getAttr(attributesBlock, 'android:strokeColor');
      const strokeWidthStr = getAttr(attributesBlock, 'android:strokeWidth');
      const strokeWidth = strokeWidthStr ? parseFloat(strokeWidthStr) : 0;
      const strokeAlphaStr = getAttr(attributesBlock, 'android:strokeAlpha');
      const strokeAlpha = strokeAlphaStr ? parseFloat(strokeAlphaStr) : 1.0;

      const fillTypeStr = getAttr(attributesBlock, 'android:fillType');
      const fillType = (fillTypeStr && fillTypeStr.toLowerCase() === 'evenodd') ? 'evenodd' : 'nonzero';

      // Advanced Color Handling:
      // If fillColor is missing, OR it is explicitly transparent (#00000000), 
      // check if there is a complex color (gradient) in the children <aapt:attr>.
      // We can't render the gradient perfectly with regex, but we can pick a representative color.
      if (!fillColor || fillColor === '#00000000') {
        // Simple heuristic: check if we are looking for a fill gradient
        if (contentBlock.includes('android:fillColor')) {
           const fallback = findFallbackGradientColor(contentBlock);
           if (fallback) fillColor = fallback;
        }
      }

      // Same logic for stroke
      if ((!strokeColor || strokeColor === '#00000000') && strokeWidth > 0) {
        if (contentBlock.includes('android:strokeColor')) {
          const fallback = findFallbackGradientColor(contentBlock);
          if (fallback) strokeColor = fallback;
        }
      }

      paths.push({
        pathData,
        fillColor: fillColor || undefined, // undefined lets the renderer decide (or skip fill)
        fillAlpha,
        strokeColor: strokeColor || undefined,
        strokeWidth,
        strokeAlpha,
        fillType
      });
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