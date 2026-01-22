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
│       ├── sample-data/  # Sample TEI files
│       ├── manifest.json # IIIF manifest (links to external images)
│       └── images/       # Optional: local images (fallback)
└── README.md            # This file
```

## Technology Stack

- **Frontend**: React 18 + Vite
- **Image Viewer**: OpenSeadragon 5.0
- **Standard**: TEI (Text Encoding Initiative) + IIIF
- **Image Source**: IIIF Manifest (loads images from external IIIF servers)
- **Zero external dependencies**: No Java, no IIIF server required

## Prerequisites

- **Node.js** 18 or higher ([download here](https://nodejs.org/))

That's it! No Java, no external servers, no complexity.

Check if you have Node.js:
```bash
node --version
```

## Quick Start

**Never used a terminal before?** → See [SIMPLE-SETUP.md](SIMPLE-SETUP.md) for complete beginner instructions.

**Experienced users:**

```bash
# 1. Clone the repository
git clone https://github.com/friendlynihilist/pip-viewer.git
cd pip-viewer/frontend

# 2. Install dependencies
npm install

# 3. Start the application
npm run dev
```

Open http://localhost:5173 in your browser.

To stop: press `Ctrl+C`

## Using Your Own Manuscript

This viewer supports two ways to load images:

### Option 1: IIIF Manifest (Recommended)

If you have a IIIF manifest with your manuscript images hosted on a IIIF server:

1. Copy your IIIF manifest to `frontend/public/manifest.json`
2. Make sure your TEI XML references match the canvas order (e.g., `seq1.jpg` for first canvas, `seq2.jpg` for second, etc.)
3. Copy your TEI XML to `frontend/public/sample-data/your-file.xml`
4. Edit `frontend/src/components/App.jsx` (line ~36):
   ```javascript
   const data = await parseTEI('/sample-data/your-file.xml');
   ```

**Benefits**: No need to host images locally, works on static hosting (Netlify, etc.), uses high-resolution IIIF images.

### Option 2: Local Images (Fallback)

If you don't have a IIIF manifest:

1. Copy your manuscript images to `frontend/public/images/`
2. Images should be named to match your TEI references (e.g., `seq1.jpg`, `seq2.jpg`)
3. Copy your TEI XML to `frontend/public/sample-data/your-file.xml`
4. Edit `frontend/src/components/App.jsx` as above

**For detailed beginner instructions**, see: [SIMPLE-SETUP.md](SIMPLE-SETUP.md)


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


## Configuration

### Change Frontend Port

Edit `frontend/vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000, // change port
  }
})
```

## Troubleshooting

### Images don't load

**Problem**: Right panel shows "Unable to load image" error

**Solutions**:
1. Make sure your images are in `frontend/public/images/`
2. Check that image file names match the references in your TEI XML exactly
3. Image names are case-sensitive on Mac/Linux
4. Check browser console (F12) for detailed errors

### XML file doesn't load

**Problem**: "Unable to load TEI document" error

**Solutions**:
1. Make sure the file is in `frontend/public/sample-data/`
2. Check XML syntax (must be well-formed)
3. Open browser console (F12) to see detailed errors

### Build for Production

```bash
cd frontend
npm run build
```

The compiled files will be in `frontend/dist/`. Serve with a static web server (nginx, Apache, etc.).

## Future Extensions

The viewer is designed to be extensible. Future developments could include:

- **IIIF Annotations**: Integration with Annotorious or Mirador
- **Full-Text Search**: Search within TEI text with highlighting
- **Multi-Document**: Managing collections of documents
- **Export**: Export annotations in W3C Web Annotation format
- **Scroll Synchronization**: Parallel scrolling between text and image
- **Version Comparison**: Side-by-side visualization of different versions

## Code Structure

### Frontend

```
frontend/src/
├── components/
│   ├── App.jsx              # Main component, layout
│   ├── XMLViewer.jsx        # TEI text display
│   ├── ImageViewer.jsx      # OpenSeadragon integration
│   └── Pagination.jsx       # Navigation controls
├── services/
│   ├── xmlParser.js         # TEI parser, page extraction
│   └── iiifService.js       # Image URL management
└── hooks/
    └── usePagination.js     # Pagination state hook
```

### Key Services

**xmlParser.js**:
- `parseTEI(path)`: Loads and parses TEI document
- `extractPages(doc)`: Extracts pages based on `<pb>` elements
- `extractMetadata(doc)`: Extracts metadata from `<teiHeader>`

**iiifService.js**:
- `loadManifest()`: Loads IIIF manifest from `/manifest.json`
- `buildImageMap()`: Maps image IDs (seq1.jpg, seq2.jpg) to IIIF URLs from manifest
- `buildImageUrl(id)`: Builds image URL (from manifest or local fallback)
- `buildTileSource(id)`: Creates tile source for OpenSeadragon (IIIF info.json URL)

**usePagination.js**:
- React hook for managing pagination state and synchronization

## Contributing

Contributions are welcome! Areas for improvement:

1. Support for more TEI elements
2. File upload interface
3. Annotation system
4. Full-text search
5. Automated tests
6. Accessibility (ARIA, keyboard navigation)

## Resources

### TEI
- [TEI Guidelines](https://tei-c.org/guidelines/)
- [TEI by Example](https://teibyexample.org/)

### Libraries
- [OpenSeadragon](https://openseadragon.github.io/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

Carlo Teo Pedretti

## Acknowledgments

- TEI Consortium
- OpenSeadragon Team
- React and Vite communities
