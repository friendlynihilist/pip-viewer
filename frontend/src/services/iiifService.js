/**
 * Image Service - Uses IIIF manifest from Harvard
 * No local images needed - fetches directly from Harvard's IIIF server
 */

let manifestCache = null;
let imageMapCache = null;

/**
 * Load and parse IIIF manifest
 * @returns {Promise<Object>} - Parsed manifest
 */
async function loadManifest() {
  if (manifestCache) {
    return manifestCache;
  }

  try {
    const response = await fetch('/manifest.json');
    if (!response.ok) {
      throw new Error('Failed to load manifest');
    }
    manifestCache = await response.json();
    return manifestCache;
  } catch (error) {
    console.error('Error loading manifest:', error);
    throw error;
  }
}

/**
 * Build image URL map from manifest
 * Maps seq1.jpg -> IIIF URL, seq2.jpg -> IIIF URL, etc.
 * @returns {Promise<Object>} - Map of image IDs to IIIF URLs
 */
async function buildImageMap() {
  if (imageMapCache) {
    return imageMapCache;
  }

  const manifest = await loadManifest();
  const imageMap = {};

  if (manifest.sequences && manifest.sequences[0] && manifest.sequences[0].canvases) {
    manifest.sequences[0].canvases.forEach((canvas, index) => {
      const seqNumber = index + 1;
      const imageId = `seq${seqNumber}.jpg`;

      // Extract IIIF service URL from canvas
      if (canvas.images && canvas.images[0] && canvas.images[0].resource) {
        const resource = canvas.images[0].resource;
        if (resource.service && resource.service['@id']) {
          imageMap[imageId] = resource.service['@id'];
        }
      }
    });
  }

  imageMapCache = imageMap;
  return imageMap;
}

/**
 * Builds IIIF URL from image identifier
 * @param {string} imageId - Image identifier (e.g., "seq1.jpg")
 * @returns {Promise<string>} - Full IIIF URL
 */
export async function buildImageUrl(imageId) {
  if (!imageId) {
    return null;
  }

  // Remove leading slash or # if present
  let cleanId = imageId.startsWith('/') ? imageId.substring(1) : imageId;
  cleanId = cleanId.startsWith('#') ? cleanId.substring(1) : cleanId;

  // Get image map from manifest
  const imageMap = await buildImageMap();

  // Return IIIF URL from manifest if available
  if (imageMap[cleanId]) {
    return imageMap[cleanId];
  }

  // Fallback: construct local URL (for images not in manifest)
  return `/images/${cleanId}`;
}

/**
 * Builds OpenSeadragon tile source configuration
 * @param {string} imageId - Image identifier
 * @returns {Promise<Object|string|null>} - Tile source config for OpenSeadragon
 */
export async function buildTileSource(imageId) {
  if (!imageId) {
    return null;
  }

  const iiifUrl = await buildImageUrl(imageId);

  if (!iiifUrl) {
    return null;
  }

  // If it's a full IIIF service URL, append /info.json for OpenSeadragon
  if (iiifUrl.startsWith('http')) {
    return `${iiifUrl}/info.json`;
  }

  // Otherwise, return simple image tile source
  return {
    type: 'image',
    url: iiifUrl
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
