# Frontend - TEI-IIIF Viewer

React application for viewing TEI documents with images.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens browser at `http://localhost:5173`

## Build

```bash
npm run build
```

Output in `dist/`

## Preview Build

```bash
npm run preview
```

## Structure

```
src/
├── components/          # React components
│   ├── App.jsx         # Main layout
│   ├── XMLViewer.jsx   # TEI text viewer
│   ├── ImageViewer.jsx # Image viewer
│   └── Pagination.jsx  # Navigation controls
├── services/           # Business logic
│   ├── xmlParser.js    # TEI document parser
│   └── iiifService.js  # Image URL management
├── hooks/              # Custom React hooks
│   └── usePagination.js
└── main.jsx           # Entry point
```

## Main Dependencies

- **react**: ^18.3.1
- **react-dom**: ^18.3.1
- **openseadragon**: ^5.0.0
- **vite**: ^5.4.11 (dev)

## Configuration

### Change Default TEI File

Edit `src/components/App.jsx`:

```javascript
const data = await parseTEI('/sample-data/your-file.xml');  // Change path here
```

## Adding New Documents

### Option 1: With IIIF Manifest (Recommended)

1. Place IIIF manifest in `public/manifest.json`
2. Place XML file in `public/sample-data/`
3. Ensure TEI references match manifest (seq1.jpg, seq2.jpg, etc.)
4. Edit App.jsx to load the new file

### Option 2: Local Images (Fallback)

1. Place XML file in `public/sample-data/`
2. Place images in `public/images/`
3. Edit App.jsx to load the new file

## Debug

Open browser console (F12) to see:
- XML parsing errors
- Image loading errors
- TEI parser logs

## Testing

TODO: Add tests with Vitest

## Production

For deployment:

1. Build: `npm run build`
2. Serve files in `dist/` with a static web server
3. Verify CORS is configured correctly

## Extending the Viewer

### Add Support for New TEI Elements

Edit `src/components/XMLViewer.jsx`, function `transformTEItoHTML`:

```javascript
const tagMap = {
  'p': 'p',
  'head': 'h3',
  'new-element': 'html-tag',  // Add here
  // ...
};
```

### Add New Features

Create new components in `src/components/` and import them in `App.jsx`.

For features requiring shared state, consider using Context API or a state management library.
