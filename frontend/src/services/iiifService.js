/**
 * Servizio per la gestione degli URL IIIF
 */

// Configurazione base per il server IIIF Cantaloupe
const IIIF_CONFIG = {
  baseUrl: 'http://localhost:8182/iiif/2',
  version: '2.0'
};

/**
 * Costruisce l'URL completo per l'info.json di un'immagine IIIF
 * @param {string} imageId - ID dell'immagine (o nome file)
 * @returns {string} - URL completo per info.json
 */
export function buildIIIFInfoUrl(imageId) {
  if (!imageId) {
    return null;
  }

  // Se l'imageId è già un URL completo, restituiscilo
  if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
    // Se finisce già con info.json, restituiscilo così com'è
    if (imageId.endsWith('info.json')) {
      return imageId;
    }
    // Altrimenti aggiungi info.json
    return `${imageId}/info.json`;
  }

  // Rimuovi eventuali caratteri # iniziali (riferimenti interni)
  const cleanId = imageId.startsWith('#') ? imageId.substring(1) : imageId;

  // Costruisci l'URL IIIF
  return `${IIIF_CONFIG.baseUrl}/${encodeURIComponent(cleanId)}/info.json`;
}

/**
 * Costruisce l'URL per una tile source compatibile con OpenSeadragon
 * @param {string} imageId - ID dell'immagine
 * @returns {string} - URL info.json per OpenSeadragon
 */
export function buildTileSource(imageId) {
  if (!imageId) {
    return null;
  }

  // Return just the info.json URL - OpenSeadragon will auto-detect IIIF
  return buildIIIFInfoUrl(imageId);
}

/**
 * Estrae l'ID dell'immagine da un riferimento facs
 * @param {string} facsRef - Riferimento facs (può essere URL o riferimento interno)
 * @returns {string} - ID dell'immagine
 */
export function extractImageId(facsRef) {
  if (!facsRef) {
    return null;
  }

  // Se è un URL completo, prova a estrarre l'ID
  if (facsRef.startsWith('http://') || facsRef.startsWith('https://')) {
    // Estrai l'ultimo segmento del percorso
    const parts = facsRef.split('/');
    return parts[parts.length - 1];
  }

  // Se inizia con #, rimuovilo
  if (facsRef.startsWith('#')) {
    return facsRef.substring(1);
  }

  return facsRef;
}

/**
 * Verifica se un'immagine IIIF è accessibile
 * @param {string} imageId - ID dell'immagine
 * @returns {Promise<boolean>} - true se l'immagine è accessibile
 */
export async function checkImageAvailability(imageId) {
  try {
    const infoUrl = buildIIIFInfoUrl(imageId);
    const response = await fetch(infoUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Errore nel controllo disponibilità immagine:', error);
    return false;
  }
}

/**
 * Recupera le informazioni di un'immagine IIIF
 * @param {string} imageId - ID dell'immagine
 * @returns {Promise<Object>} - Oggetto con le informazioni dell'immagine
 */
export async function getImageInfo(imageId) {
  try {
    const infoUrl = buildIIIFInfoUrl(imageId);
    const response = await fetch(infoUrl);

    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }

    const info = await response.json();
    return info;
  } catch (error) {
    console.error('Errore nel recupero informazioni immagine:', error);
    throw error;
  }
}

/**
 * Configura l'URL base del server IIIF
 * @param {string} baseUrl - Nuovo URL base
 */
export function setIIIFBaseUrl(baseUrl) {
  IIIF_CONFIG.baseUrl = baseUrl;
}

/**
 * Ottiene la configurazione corrente
 * @returns {Object} - Configurazione IIIF
 */
export function getIIIFConfig() {
  return { ...IIIF_CONFIG };
}
