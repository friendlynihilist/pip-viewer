# Simple Setup (No Java Required)

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/friendlynihilist/pip-viewer.git
cd pip-viewer

# 2. Install dependencies
cd frontend
npm install

# 3. Start the application
npm run dev
```

That's it! Open http://localhost:5173

## Using Your Own Images

1. Put your images in `frontend/public/images/`
2. Put your TEI XML in `frontend/public/sample-data/`
3. Update the file reference in `frontend/src/components/App.jsx` (line ~36)

## Notes

- Images are now served directly from the frontend (no IIIF server needed)
- OpenSeadragon still provides zoom/pan functionality
- Much simpler setup - works on Windows/Mac/Linux without Java
