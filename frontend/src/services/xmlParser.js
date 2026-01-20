/**
 * Parser per documenti TEI/XML
 * Estrae metadati, page breaks e frammenti di testo
 */

/**
 * Carica e parsa un file XML/TEI
 * @param {string} xmlPath - Percorso del file XML
 * @returns {Promise<Document>} - Documento XML parsato
 */
export async function loadXML(xmlPath) {
  try {
    const response = await fetch(xmlPath);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Verifica errori di parsing
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Errore nel parsing XML: ' + parserError.textContent);
    }

    return xmlDoc;
  } catch (error) {
    console.error('Errore nel caricamento del file XML:', error);
    throw error;
  }
}

/**
 * Estrae i metadati dal teiHeader
 * @param {Document} xmlDoc - Documento XML parsato
 * @returns {Object} - Oggetto con metadati
 */
export function extractMetadata(xmlDoc) {
  const metadata = {
    title: '',
    author: '',
    date: ''
  };

  try {
    const ns = 'http://www.tei-c.org/ns/1.0';

    // Try with namespace first, then fallback
    let titles = xmlDoc.getElementsByTagNameNS(ns, 'title');
    if (titles.length === 0) titles = xmlDoc.getElementsByTagName('title');
    if (titles.length > 0) {
      metadata.title = titles[0].textContent.trim();
    }

    let authors = xmlDoc.getElementsByTagNameNS(ns, 'author');
    if (authors.length === 0) authors = xmlDoc.getElementsByTagName('author');
    if (authors.length > 0) {
      metadata.author = authors[0].textContent.trim();
    }

    let dates = xmlDoc.getElementsByTagNameNS(ns, 'date');
    if (dates.length === 0) dates = xmlDoc.getElementsByTagName('date');
    if (dates.length > 0) {
      metadata.date = dates[0].textContent.trim();
    }
  } catch (error) {
    console.error('Error extracting metadata:', error);
  }

  return metadata;
}

/**
 * Estrae la mappa delle immagini dalla sezione facsimile
 * @param {Document} xmlDoc - Documento XML parsato
 * @returns {Map} - Mappa id -> url immagine
 */
export function extractFacsimileMap(xmlDoc) {
  const facsMap = new Map();

  try {
    const ns = 'http://www.tei-c.org/ns/1.0';

    let surfaces = xmlDoc.getElementsByTagNameNS(ns, 'surface');
    if (surfaces.length === 0) {
      surfaces = xmlDoc.getElementsByTagName('surface');
    }

    Array.from(surfaces).forEach(surface => {
      const id = surface.getAttributeNS('http://www.w3.org/XML/1998/namespace', 'id') ||
                 surface.getAttribute('xml:id') ||
                 surface.getAttribute('id');

      let graphics = surface.getElementsByTagNameNS(ns, 'graphic');
      if (graphics.length === 0) {
        graphics = surface.getElementsByTagName('graphic');
      }

      if (id && graphics.length > 0) {
        const url = graphics[0].getAttribute('url');
        if (url) {
          facsMap.set('#' + id, url);
        }
      }
    });
  } catch (error) {
    console.error('Error extracting facsimile map:', error);
  }

  return facsMap;
}

/**
 * Serializza un frammento XML in stringa HTML
 * @param {Node} node - Nodo XML da serializzare
 * @returns {string} - HTML serializzato
 */
function serializeNode(node) {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(node);
}

/**
 * Estrae le pagine dal documento TEI basandosi sui tag <pb>
 * @param {Document} xmlDoc - Documento XML parsato
 * @returns {Array} - Array di oggetti pagina {pageNumber, xmlContent, facsUrl}
 */
export function extractPages(xmlDoc) {
  const pages = [];
  const facsMap = extractFacsimileMap(xmlDoc);

  try {
    // Use getElementsByTagNameNS to handle XML namespaces properly
    let body = xmlDoc.getElementsByTagNameNS('http://www.tei-c.org/ns/1.0', 'body')[0];
    if (!body) {
      // Fallback: try without namespace
      body = xmlDoc.getElementsByTagName('body')[0];
    }
    if (!body) {
      console.warn('No <body> element found in document');
      return pages;
    }

    // Find all <pb> elements using getElementsByTagNameNS
    let pageBreaks = Array.from(body.getElementsByTagNameNS('http://www.tei-c.org/ns/1.0', 'pb'));
    if (pageBreaks.length === 0) {
      // Fallback: try without namespace
      pageBreaks = Array.from(body.getElementsByTagName('pb'));
    }

    if (pageBreaks.length === 0) {
      // Se non ci sono page breaks, considera l'intero body come una singola pagina
      pages.push({
        pageNumber: 1,
        xmlContent: serializeNode(body),
        facsUrl: null
      });
      return pages;
    }

    // Processa ogni pagina
    pageBreaks.forEach((pb, index) => {
      const pageNumber = index + 1;
      let facsUrl = pb.getAttribute('facs');

      // Se facs è un riferimento interno (inizia con #), cerca nella mappa facsimile
      if (facsUrl && facsUrl.startsWith('#')) {
        facsUrl = facsMap.get(facsUrl) || facsUrl;
      }

      // Raccoglie tutti i nodi tra questo <pb> e il prossimo
      const pageContent = [];
      let currentNode = pb.nextSibling;
      const nextPb = pageBreaks[index + 1];

      while (currentNode && currentNode !== nextPb) {
        if (currentNode.nodeType === Node.ELEMENT_NODE ||
            (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent.trim())) {
          pageContent.push(currentNode.cloneNode(true));
        }
        currentNode = currentNode.nextSibling;
      }

      // Crea un contenitore temporaneo per serializzare il contenuto
      const tempDiv = xmlDoc.createElement('div');
      pageContent.forEach(node => tempDiv.appendChild(node));

      pages.push({
        pageNumber,
        xmlContent: tempDiv.innerHTML || '',
        facsUrl
      });
    });
  } catch (error) {
    console.error('Errore nell\'estrazione delle pagine:', error);
  }

  return pages;
}

/**
 * Funzione principale per parsare un documento TEI
 * @param {string} xmlPath - Percorso del file XML
 * @returns {Promise<Object>} - Oggetto con metadati e pagine
 */
export async function parseTEI(xmlPath) {
  const xmlDoc = await loadXML(xmlPath);
  const metadata = extractMetadata(xmlDoc);
  const pages = extractPages(xmlDoc);

  return {
    metadata,
    pages,
    totalPages: pages.length
  };
}
