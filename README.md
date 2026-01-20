# TEI-IIIF Viewer

A prototype viewer for synchronized visualization of TEI/XML documents and high-resolution IIIF images.

## Features

- **Split-View Display**: TEI text on the left, IIIF images on the right
- **Synchronized Pagination**: Based on `<pb facs>` elements in TEI
- **Zoom and Pan**: Smooth navigation of high-resolution images with OpenSeadragon
- **Intelligent Rendering**: Automatic TEI → HTML transformation with semantic styles
- **IIIF Protocol**: International standard for image interoperability

## Architecture

```
pip-viewer/
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── components/   # XMLViewer, ImageViewer, Pagination
│   │   ├── services/     # TEI parser, IIIF service
│   │   └── hooks/        # usePagination
│   └── public/
│       └── sample-data/  # Sample TEI files
├── cantaloupe/           # Cantaloupe IIIF Server
│   ├── images/          # Source images
│   └── cache/           # Derived image cache
└── README.md            # This file
```

## Technology Stack

- **Frontend**: React 18 + Vite
- **Image Viewer**: OpenSeadragon 5.0
- **Image Server**: Cantaloupe IIIF Server
- **Standard**: TEI (Text Encoding Initiative), IIIF Image API 2.0

## Prerequisites

- **Node.js** 18 or higher
- **Java** 11 or higher (for Cantaloupe)
- **npm** or **yarn**

Check versions:
```bash
node --version
java -version
npm --version
```

## Manuscript Images

The manuscript images for this project need to be downloaded separately due to their size (~630MB).

**Download the images here**: [ADD YOUR LINK HERE]

After downloading, extract the images to `cantaloupe/images/` directory:

```bash
# After downloading the images archive
unzip images.zip -d cantaloupe/images/
# or
tar -xzf images.tar.gz -C cantaloupe/images/
```

## Quick Installation (Recommended)

### Automated Setup

```bash
# 1. Initial setup (installs everything automatically)
./setup.sh

# 2. Create test images (optional, to test immediately)
./create-sample-images.sh

# 3. Start the application
./start.sh
```

The viewer will open at `http://localhost:5173`

To stop: press `Ctrl+C`

**To use your own documents**, see: [QUICK-START.md](QUICK-START.md)

## Manual Installation (Alternative)

<details>
<summary>Click to expand manual instructions</summary>

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pip-viewer
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cd ..
```

### 3. Cantaloupe Setup (IIIF Server)

#### a) Download Cantaloupe

```bash
cd cantaloupe
curl -OL https://github.com/cantaloupe-project/cantaloupe/releases/download/v5.0.6/cantaloupe-5.0.6.zip
unzip cantaloupe-5.0.6.zip
cd ..
```

#### b) Prepare the Images

Copy images to the `cantaloupe/images/` directory:

```bash
# Example with placeholder images
cd cantaloupe/images
curl -o page-1.jpg "https://via.placeholder.com/2000x3000/cccccc/333333?text=Page+1"
curl -o page-2.jpg "https://via.placeholder.com/2000x3000/cccccc/333333?text=Page+2"
curl -o page-3.jpg "https://via.placeholder.com/2000x3000/cccccc/333333?text=Page+3"
curl -o page-4.jpg "https://via.placeholder.com/2000x3000/cccccc/333333?text=Page+4"
cd ../..
```

### 4. Manual Startup (2 Terminals)

**Terminal 1 - Cantaloupe:**
```bash
cd cantaloupe
java -Dcantaloupe.config=./cantaloupe.properties -Xmx2g -jar cantaloupe-5.0.6/cantaloupe-5.0.6.jar
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

</details>

## Usage

1. Open browser at `http://localhost:5173`
2. The viewer automatically loads the sample file `sample.xml`
3. Use pagination controls at the bottom to navigate:
   - **Previous/Next**: Navigate between pages
   - **Go to page**: Jump directly to a specific page
4. In the right panel:
   - **Zoom**: Mouse wheel or +/- buttons
   - **Pan**: Drag with mouse
   - **Reset**: Double-click

## TEI File Structure

The viewer requires TEI documents with the following structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>Document Title</title>
        <author>Author Name</author>
      </titleStmt>
      <!-- other metadata -->
    </fileDesc>
  </teiHeader>

  <!-- Optional: image map -->
  <facsimile>
    <surface xml:id="page1">
      <graphic url="page-1.jpg"/>
    </surface>
  </facsimile>

  <text>
    <body>
      <!-- Page break with image reference -->
      <pb facs="#page1"/>
      <p>Content of the first page...</p>

      <pb facs="#page2"/>
      <p>Content of the second page...</p>
    </body>
  </text>
</TEI>
```

### Supported TEI Elements

The viewer automatically transforms the following TEI elements into HTML:

| TEI Element | HTML Output | Notes |
|-------------|-------------|-------|
| `<p>` | `<p>` | Paragraph |
| `<head>` | `<h3>` | Heading |
| `<lb/>` | `<br/>` | Line break |
| `<pb facs="..."/>` | - | Page break (used for pagination) |
| `<hi rend="italic">` | `<em>` | Italic |
| `<hi rend="bold">` | `<strong>` | Bold |
| `<quote>` | `<blockquote>` | Quote |
| `<list>` | `<ul>` | List |
| `<item>` | `<li>` | List item |
| `<note>` | `<aside>` | Note |
| `<foreign>` | `<em>` | Foreign language text |
| `<title>` | `<cite>` | Work title |

## Using Your Own Documents

**Simplified Procedure:**

1. **Copy images** to `cantaloupe/images/`
   ```bash
   cp /path/to/your/images/*.jpg cantaloupe/images/
   ```

2. **Copy TEI file** to `frontend/public/sample-data/`
   ```bash
   cp /path/to/your/file.xml frontend/public/sample-data/my-document.xml
   ```

3. **Modify loading** in `frontend/src/components/App.jsx` (line ~20):
   ```javascript
   const data = await parseTEI('/sample-data/my-document.xml');
   ```

4. **Restart** with `./start.sh`

**For full details and troubleshooting**, see [QUICK-START.md](QUICK-START.md)

## Configuration

### Change Frontend Port

Edit `frontend/vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000, // cambiare porta
  }
})
```

### Modificare la Porta di Cantaloupe

1. Modificare `cantaloupe/cantaloupe.properties`:
```properties
http.port = 8080
```

2. Aggiornare `frontend/src/services/iiifService.js`:
```javascript
const IIIF_CONFIG = {
  baseUrl: 'http://localhost:8080/iiif/2',
  version: '2.0'
};
```

## Troubleshooting

### Le immagini non si caricano

**Problema**: Pannello destro mostra errore "Impossibile caricare l'immagine"

**Soluzioni**:
1. Verificare che Cantaloupe sia in esecuzione: `http://localhost:8182`
2. Testare l'accesso a un'immagine: `http://localhost:8182/iiif/2/page-1.jpg/info.json`
3. Verificare che i nomi dei file corrispondano ai riferimenti nel TEI
4. Controllare i log di Cantaloupe per errori

### Il file XML non viene caricato

**Problema**: Errore "Impossibile caricare il documento TEI"

**Soluzioni**:
1. Verificare che il file sia in `frontend/public/sample-data/`
2. Controllare la sintassi XML (deve essere well-formed)
3. Aprire la console del browser (F12) per vedere errori dettagliati

### Errori CORS

**Problema**: Errori di Cross-Origin Resource Sharing

**Soluzioni**:
- Cantaloupe gestisce automaticamente CORS per IIIF
- Assicurarsi che frontend e Cantaloupe siano sullo stesso host in produzione

### Build per Produzione

```bash
cd frontend
npm run build
```

I file compilati saranno in `frontend/dist/`. Servire con un web server statico (nginx, Apache, ecc.).

Per Cantaloupe in produzione, vedere: `cantaloupe/README.md`

## Estensioni Future

Il viewer è progettato per essere estensibile. Sviluppi futuri potrebbero includere:

- **Annotazioni IIIF**: Integrazione con Annotorious o Mirador
- **Ricerca Full-Text**: Ricerca nel testo TEI con evidenziazione
- **Multi-Documento**: Gestione di collezioni di documenti
- **Export**: Esportazione annotazioni in formato W3C Web Annotation
- **Sincronizzazione Scroll**: Scroll parallelo tra testo e immagine
- **Confronto Versioni**: Visualizzazione side-by-side di versioni diverse

## Struttura del Codice

### Frontend

```
frontend/src/
├── components/
│   ├── App.jsx              # Componente principale, layout
│   ├── XMLViewer.jsx        # Visualizzazione testo TEI
│   ├── ImageViewer.jsx      # Integrazione OpenSeadragon
│   └── Pagination.jsx       # Controlli navigazione
├── services/
│   ├── xmlParser.js         # Parser TEI, estrazione pagine
│   └── iiifService.js       # Gestione URL IIIF
└── hooks/
    └── usePagination.js     # Hook per stato paginazione
```

### Servizi Chiave

**xmlParser.js**:
- `parseTEI(path)`: Carica e parsa documento TEI
- `extractPages(doc)`: Estrae pagine basate su `<pb>`
- `extractMetadata(doc)`: Estrae metadati da `<teiHeader>`

**iiifService.js**:
- `buildIIIFInfoUrl(id)`: Costruisce URL info.json
- `buildTileSource(id)`: Crea tile source per OpenSeadragon

**usePagination.js**:
- Hook React per gestire stato paginazione e sincronizzazione

## Contribuire

Contributi sono benvenuti! Aree di miglioramento:

1. Supporto per più elementi TEI
2. Interfaccia per caricamento file
3. Sistema di annotazioni
4. Ricerca full-text
5. Tests automatici
6. Accessibilità (ARIA, keyboard navigation)

## Risorse

### TEI
- [TEI Guidelines](https://tei-c.org/guidelines/)
- [TEI by Example](https://teibyexample.org/)

### IIIF
- [IIIF Image API](https://iiif.io/api/image/)
- [IIIF Awesome](https://github.com/IIIF/awesome-iiif)

### Librerie
- [OpenSeadragon](https://openseadragon.github.io/)
- [Cantaloupe](https://cantaloupe-project.github.io/)
- [React](https://react.dev/)

## Licenza

[Specificare licenza - es. MIT, GPL, ecc.]

## Autori

[Specificare autori e contatti]

## Ringraziamenti

- TEI Consortium
- IIIF Consortium
- OpenSeadragon Team
- Cantaloupe Project
