# Quick Start Guide

## Initial Setup (One Time Only)

### 1. Prerequisites

Install:
- **Node.js** 18+: https://nodejs.org/
- **Java** 11+: https://adoptium.net/

### 2. Automated Setup

```bash
chmod +x setup.sh
./setup.sh
```

This installs everything automatically.

## Using Your Own Documents

### Prepare the Images

1. Copy images to `cantaloupe/images/`:
   ```bash
   cp /path/to/your/images/*.jpg cantaloupe/images/
   ```

2. Name images clearly:
   - `page-1.jpg`, `page-2.jpg`, etc.
   - Or: `manuscript-f1r.jpg`, `manuscript-f1v.jpg`, etc.

### Prepare the TEI File

1. Create or copy your TEI file to `frontend/public/sample-data/`:
   ```bash
   cp /path/to/your/file.xml frontend/public/sample-data/my-document.xml
   ```

2. Verify that the TEI file contains:
   - `<pb facs="..."/>` elements for each page
   - References to images that match the file names

#### Minimal TEI Structure Example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>My Document</title>
        <author>Author Name</author>
      </titleStmt>
      <publicationStmt>
        <date>2026</date>
      </publicationStmt>
      <sourceDesc>
        <p>Digital transcription</p>
      </sourceDesc>
    </fileDesc>
  </teiHeader>

  <facsimile>
    <surface xml:id="p1">
      <graphic url="page-1.jpg"/>
    </surface>
    <surface xml:id="p2">
      <graphic url="page-2.jpg"/>
    </surface>
  </facsimile>

  <text>
    <body>
      <pb facs="#p1"/>
      <p>Text of the first page...</p>

      <pb facs="#p2"/>
      <p>Text of the second page...</p>
    </body>
  </text>
</TEI>
```

### 3. Configure File Loading

Edit `frontend/src/components/App.jsx` at line ~20:

```javascript
// Change from:
const data = await parseTEI('/sample-data/sample.xml');

// To:
const data = await parseTEI('/sample-data/my-document.xml');
```

## Starting the Application

```bash
chmod +x start.sh
./start.sh
```

This automatically starts:
- The Cantaloupe IIIF server (port 8182)
- The React frontend (port 5173)

The browser will automatically open to `http://localhost:5173`

## Stopping

Press `Ctrl+C` in the terminal where `./start.sh` is running

## Complete Workflow

```bash
# 1. Initial setup (first time only)
./setup.sh

# 2. Copy your images
cp /path/to/images/*.jpg cantaloupe/images/

# 3. Copy your TEI file
cp /path/to/document.xml frontend/public/sample-data/

# 4. Edit App.jsx to load your file
# (see above)

# 5. Start
./start.sh
```

## Quick Test with Sample Data

To test the system immediately:

```bash
# 1. Setup
./setup.sh

# 2. Create test images
chmod +x create-sample-images.sh
./create-sample-images.sh

# 3. Start (already uses the sample TEI file)
./start.sh
```

## Troubleshooting

### "Unable to load image"

- Verify Cantaloupe is running: http://localhost:8182
- Verify images are in `cantaloupe/images/`
- Verify file names match TEI references
- Check log: `tail -f cantaloupe/cantaloupe.log`

### "Unable to load TEI document"

- Verify XML file is in `frontend/public/sample-data/`
- Verify path in App.jsx is correct
- Check XML is well-formed (open in browser or XML editor)
- Check browser console (F12) for detailed errors

### Port already in use

If port 8182 or 5173 is already in use:

1. **Change Cantaloupe port**: edit `cantaloupe/cantaloupe.properties`:
   ```properties
   http.port = 8183
   ```
   And in `frontend/src/services/iiifService.js`:
   ```javascript
   baseUrl: 'http://localhost:8183/iiif/2'
   ```

2. **Change Frontend port**: edit `frontend/vite.config.js`:
   ```javascript
   server: { port: 3000 }
   ```

## Useful Links

- Frontend: http://localhost:5173
- IIIF Server: http://localhost:8182
- Test image: http://localhost:8182/iiif/2/page-1.jpg/info.json
- Full documentation: README.md
