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
 * Strategy: First check if image exists locally, then fallback to IIIF manifest
 * @param {string} imageId - Image identifier (e.g., "seq1.jpg")
 * @returns {Promise<string>} - Full IIIF URL or local URL
 */
export async function buildImageUrl(imageId) {
  if (!imageId) {
    return null;
  }

  // Remove leading slash or # if present
  let cleanId = imageId.startsWith('/') ? imageId.substring(1) : imageId;
  cleanId = cleanId.startsWith('#') ? cleanId.substring(1) : cleanId;

  // PRIORITY 1: Check if image exists locally (with proper content-type check)
  const localUrl = `/images/${cleanId}`;
  try {
    const response = await fetch(localUrl, { method: 'HEAD' });
    // Check if it's actually an image, not a redirect to index.html
    const contentType = response.headers.get('content-type');
    if (response.ok && contentType && contentType.startsWith('image/')) {
      // Image exists locally - use it
      console.log(`Using local image: ${localUrl}`);
      return localUrl;
    } else {
      console.log(`Local check: ${localUrl} returned ${contentType}, not an image. Trying manifest...`);
    }
  } catch (error) {
    // Local image doesn't exist or fetch failed, continue to manifest
    console.log(`Local image not found: ${localUrl}, trying manifest...`);
  }

  // PRIORITY 2: Try to get URL from IIIF manifest
  try {
    const imageMap = await buildImageMap();
    if (imageMap[cleanId]) {
      console.log(`Using IIIF URL from manifest for ${cleanId}`);
      return imageMap[cleanId];
    }
  } catch (error) {
    console.error('Error loading manifest:', error);
  }

  // FALLBACK: Return local URL anyway (will show error in UI if not found)
  console.warn(`No image source found for ${cleanId}, defaulting to local path`);
  return localUrl;
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

/**
 * Extract metadata from IIIF manifest
 * @returns {Promise<Object>} - Manifest metadata
 */
export async function getManifestMetadata() {
  try {
    const manifest = await loadManifest();

    const metadata = {
      title: manifest.label || 'Untitled',
      id: manifest['@id'] || manifest.id,
      type: manifest['@type'] || manifest.type,
      license: manifest.license,
      logo: manifest.logo,
    };

    // Extract sequences info
    if (manifest.sequences && manifest.sequences[0]) {
      const sequence = manifest.sequences[0];
      metadata.sequenceId = sequence['@id'];
      metadata.canvasCount = sequence.canvases ? sequence.canvases.length : 0;
    }

    // Extract metadata array if present
    if (manifest.metadata && Array.isArray(manifest.metadata)) {
      manifest.metadata.forEach(item => {
        if (item.label && item.value) {
          const key = item.label.replace(/[^a-zA-Z0-9]/g, '');
          metadata[key] = item.value;
        }
      });
    }

    // Extract attribution if present
    if (manifest.attribution) {
      metadata.attribution = manifest.attribution;
    }

    // Extract description if present
    if (manifest.description) {
      metadata.description = manifest.description;
    }

    return metadata;
  } catch (error) {
    console.error('Error extracting manifest metadata:', error);
    return {};
  }
}
