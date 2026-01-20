import { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { buildTileSource } from '../services/iiifService';
import './ImageViewer.css';

/**
 * Component for displaying IIIF images with OpenSeadragon
 */
export default function ImageViewer({ imageId, pageNumber }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize OpenSeadragon
    if (!viewerRef.current && containerRef.current) {
      viewerRef.current = OpenSeadragon({
        element: containerRef.current,
        prefixUrl: '//openseadragon.github.io/openseadragon/images/',
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        minZoomLevel: 0.8,
        visibilityRatio: 1,
        zoomPerScroll: 2,
        showNavigationControl: true,
        navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_RIGHT,
        showNavigator: false,
        sequenceMode: false,
        preserveViewport: false,
        // Event handlers
        tileSources: []
      });

      // Event listeners to handle loading and errors
      viewerRef.current.addHandler('open', () => {
        setLoading(false);
        setError(null);
      });

      viewerRef.current.addHandler('open-failed', (event) => {
        setLoading(false);
        setError('Unable to load image. Please verify that the IIIF server is running.');
        console.error('OpenSeadragon open-failed:', event);
      });
    }

    return () => {
      // Cleanup: destroy viewer when component unmounts
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // Update image when imageId changes
  useEffect(() => {
    if (viewerRef.current && imageId) {
      setLoading(true);
      setError(null);

      try {
        const tileSource = buildTileSource(imageId);

        if (tileSource) {
          // Close current tile source before opening new one
          if (viewerRef.current.world.getItemCount() > 0) {
            viewerRef.current.close();
          }

          // Open new tile source
          viewerRef.current.open(tileSource);
        } else {
          setLoading(false);
          setError('Invalid image ID');
        }
      } catch (err) {
        setLoading(false);
        setError('Error loading image');
        console.error('ImageViewer error:', err);
      }
    } else if (viewerRef.current && !imageId) {
      // No image to display
      if (viewerRef.current.world.getItemCount() > 0) {
        viewerRef.current.close();
      }
      setLoading(false);
      setError(null);
    }
  }, [imageId]);

  return (
    <div className="image-viewer">
      <div className="image-info">
        {pageNumber && <span className="page-label">Page {pageNumber} image</span>}
        {loading && <span className="status-message loading">Loading...</span>}
      </div>

      <div className="viewer-container">
        {error && (
          <div className="error-overlay">
            <div className="error-content">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
              </svg>
              <p>{error}</p>
              <p className="error-hint">
                Make sure Cantaloupe is running at http://localhost:8182
              </p>
            </div>
          </div>
        )}

        {!imageId && !error && (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
              <path d="M21 15l-5-5L5 21" strokeWidth="2"/>
            </svg>
            <p>No image available for this page</p>
          </div>
        )}

        <div
          ref={containerRef}
          className="openseadragon-container"
          style={{ display: error || !imageId ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
}
