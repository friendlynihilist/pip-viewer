# Simple Setup Guide - For Complete Beginners

This guide assumes you've never used a terminal or npm before. Follow these steps exactly.

## Step 1: Install Node.js

Node.js is required to run this application.

### Windows

1. Go to https://nodejs.org/
2. Click the big green button that says "Download Node.js (LTS)"
3. Open the downloaded file (e.g., `node-v20.x.x-x64.msi`)
4. Click "Next" through the installer, accepting all defaults
5. Click "Install" and wait for it to finish
6. Click "Finish"

### Mac

1. Go to https://nodejs.org/
2. Click the big green button that says "Download Node.js (LTS)"
3. Open the downloaded file (e.g., `node-v20.x.x.pkg`)
4. Click "Continue" through the installer, accepting all defaults
5. Enter your Mac password when asked
6. Click "Install" and wait for it to finish

### Linux (Ubuntu/Debian)

1. Open Terminal (press Ctrl+Alt+T)
2. Copy and paste this command, then press Enter:
   ```bash
   sudo apt update && sudo apt install -y nodejs npm
   ```
3. Enter your password when asked

## Step 2: Download This Project

### Option A: Using Git (if you have it)

1. **Open Terminal/Command Prompt:**
   - **Windows**: Press Windows key, type "cmd", press Enter
   - **Mac**: Press Cmd+Space, type "terminal", press Enter
   - **Linux**: Press Ctrl+Alt+T

2. **Navigate to where you want the project** (e.g., Desktop):
   ```bash
   cd Desktop
   ```

3. **Download the project:**
   ```bash
   git clone https://github.com/friendlynihilist/pip-viewer.git
   ```

### Option B: Download ZIP (if you don't have Git)

1. Go to https://github.com/friendlynihilist/pip-viewer
2. Click the green "Code" button
3. Click "Download ZIP"
4. Find the downloaded ZIP file (usually in your Downloads folder)
5. **Windows**: Right-click → "Extract All" → Choose Desktop → Click "Extract"
6. **Mac**: Double-click the ZIP file to extract it
7. **Linux**: Right-click → "Extract Here"

## Step 3: Install Dependencies

1. **Open Terminal/Command Prompt** (see Step 2 above)

2. **Navigate to the project folder:**
   - If you extracted to Desktop:
     ```bash
     cd Desktop/pip-viewer/frontend
     ```
   - Replace "Desktop" with wherever you put the folder

3. **Install the required packages** (this will take 1-2 minutes):
   ```bash
   npm install
   ```

   You'll see a lot of text scrolling - this is normal! Wait until you see a prompt again.

## Step 4: Set Up Your Images

You have two options for images:

### Option A: Use IIIF Manifest (Recommended - No Local Images Needed!)

If you have a IIIF manifest with links to online images:

1. Navigate to: `pip-viewer/frontend/public/`
2. Replace the existing `manifest.json` with your own IIIF manifest
3. **Done!** Images will load directly from the IIIF server - no need to download them

**This is perfect for large image collections and works great on free hosting like Netlify.**

### Option B: Use Local Images (If You Don't Have a Manifest)

1. Open your file explorer/finder
2. Navigate to the project folder: `pip-viewer/frontend/public/images/`
3. **Copy your manuscript images** into this folder
   - The images should be named like: `seq1.jpg`, `seq2.jpg`, `seq3.jpg`, etc.
   - Or whatever names are referenced in your TEI XML file

**Full path examples:**
- Windows: `C:\Users\YourName\Desktop\pip-viewer\frontend\public\images\`
- Mac: `/Users/YourName/Desktop/pip-viewer/frontend/public/images/`
- Linux: `/home/yourname/Desktop/pip-viewer/frontend/public/images/`

## Step 5: Add Your TEI XML File (Optional)

If you have your own TEI XML file:

1. Navigate to: `pip-viewer/frontend/public/sample-data/`
2. Copy your XML file there (e.g., `my-manuscript.xml`)
3. Open `pip-viewer/frontend/src/components/App.jsx` in a text editor
4. Find line ~36 that says:
   ```javascript
   const data = await parseTEI('/sample-data/hou02614c00333_tei.xml');
   ```
5. Change it to:
   ```javascript
   const data = await parseTEI('/sample-data/my-manuscript.xml');
   ```
6. Save the file

## Step 6: Start the Application

1. **Make sure you're in the right folder** (from Step 3):
   ```bash
   cd Desktop/pip-viewer/frontend
   ```

2. **Start the viewer:**
   ```bash
   npm run dev
   ```

3. **Wait for the startup message**. You'll see something like:
   ```
   VITE v5.x.x  ready in 500 ms

   ➜  Local:   http://localhost:5173/
   ```

4. **Open your web browser** and go to: http://localhost:5173

   The viewer should now be running!

## Step 7: Stop the Application

When you're done:

1. Go back to the Terminal/Command Prompt window
2. Press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac)
3. The application will stop

## Next Time You Use It

You only need to do Steps 1-4 once. Next time:

1. Open Terminal/Command Prompt
2. Navigate to the frontend folder:
   ```bash
   cd Desktop/pip-viewer/frontend
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## Troubleshooting

### "command not found: npm"

- Node.js is not installed correctly. Go back to Step 1.

### "Cannot find module"

- Dependencies are not installed. Go back to Step 3.

### "Address already in use"

- Port 5173 is busy. The application will automatically use a different port (e.g., 5174). Look at the terminal output for the correct URL.

### Images don't load

- Make sure your images are in `frontend/public/images/`
- Make sure the image names in your TEI XML match the actual file names exactly (including .jpg extension)
- Image names are case-sensitive on Mac/Linux

### Still having problems?

Open an issue at: https://github.com/friendlynihilist/pip-viewer/issues
