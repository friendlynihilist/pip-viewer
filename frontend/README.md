# Frontend - TEI-IIIF Viewer

Applicazione React per la visualizzazione di documenti TEI con immagini IIIF.

## Setup

```bash
npm install
```

## Sviluppo

```bash
npm run dev
```

Apre il browser su `http://localhost:5173`

## Build

```bash
npm run build
```

Output in `dist/`

## Preview Build

```bash
npm run preview
```

## Struttura

```
src/
├── components/          # Componenti React
│   ├── App.jsx         # Layout principale
│   ├── XMLViewer.jsx   # Viewer testo TEI
│   ├── ImageViewer.jsx # Viewer immagini IIIF
│   └── Pagination.jsx  # Controlli navigazione
├── services/           # Logica di business
│   ├── xmlParser.js    # Parser documenti TEI
│   └── iiifService.js  # Gestione URL IIIF
├── hooks/              # Custom React hooks
│   └── usePagination.js
└── main.jsx           # Entry point
```

## Dipendenze Principali

- **react**: ^18.3.1
- **react-dom**: ^18.3.1
- **openseadragon**: ^5.0.0
- **vite**: ^5.4.11 (dev)

## Configurazione

### Modificare il Server IIIF

Modificare `src/services/iiifService.js`:

```javascript
const IIIF_CONFIG = {
  baseUrl: 'http://localhost:8182/iiif/2',  // Cambiare URL qui
  version: '2.0'
};
```

### Modificare il File TEI di Default

Modificare `src/components/App.jsx`:

```javascript
const data = await parseTEI('/sample-data/sample.xml');  // Cambiare path qui
```

## Aggiungere Nuovi Documenti

1. Posizionare il file XML in `public/sample-data/`
2. Assicurarsi che le immagini referenziate siano in Cantaloupe
3. Modificare App.jsx per caricare il nuovo file

## Debug

Aprire la console del browser (F12) per vedere:
- Errori di parsing XML
- Errori di caricamento immagini
- Log del parser TEI

## Testing

TODO: Aggiungere test con Vitest

## Produzione

Per il deploy:

1. Build: `npm run build`
2. Servire i file in `dist/` con un web server statico
3. Configurare il reverse proxy per Cantaloupe se necessario
4. Verificare che i CORS siano configurati correttamente

## Estendere il Viewer

### Aggiungere Supporto per Nuovi Elementi TEI

Modificare `src/components/XMLViewer.jsx`, funzione `transformTEItoHTML`:

```javascript
const tagMap = {
  'p': 'p',
  'head': 'h3',
  'nuovo-elemento': 'tag-html',  // Aggiungere qui
  // ...
};
```

### Aggiungere Nuove Funzionalità

Creare nuovi componenti in `src/components/` e importarli in `App.jsx`.

Per funzionalità che richiedono stato condiviso, considerare l'uso di Context API o una libreria di state management.
