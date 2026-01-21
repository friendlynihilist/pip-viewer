/**
 * Image Service - Simplified (no IIIF server required)
 * Serves images directly from public folder
 */

/**
 * Builds image URL from image identifier
 * @param {string} imageId - Image identifier (filename)
 * @returns {string} - Full image URL
 */
export function buildImageUrl(imageId) {
  if (!imageId) {
    return null;
  }

  // Remove leading slash or # if present
  let cleanId = imageId.startsWith('/') ? imageId.substring(1) : imageId;
  cleanId = cleanId.startsWith('#') ? cleanId.substring(1) : cleanId;

  // Images are served from /images/ in public folder
  return `/images/${cleanId}`;
}

/**
 * Builds OpenSeadragon tile source configuration
 * @param {string} imageId - Image identifier
 * @returns {Object|null} - Tile source config for OpenSeadragon
 */
export function buildTileSource(imageId) {
  if (!imageId) {
    return null;
  }

  // Return simple image tile source for OpenSeadragon
  return {
    type: 'image',
    url: buildImageUrl(imageId)
  };
}

/**
 * Extract image ID from facs reference
 * @param {string} facsRef - Facs reference (can be URL or internal ref)
 * @returns {string} - Image ID
 */
export function extractImageId(facsRef) {
  if (!facsRef) {
    return null;
  }

  // If it's a full URL, extract the last segment
  if (facsRef.startsWith('http://') || facsRef.startsWith('https://')) {
    const parts = facsRef.split('/');
    return parts[parts.length - 1];
  }

  // If it starts with #, remove it
  if (facsRef.startsWith('#')) {
    return facsRef.substring(1);
  }

  return facsRef;
}
