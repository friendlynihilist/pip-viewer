import { useState, useEffect } from 'react';
import XMLViewer from './XMLViewer';
import ImageViewer from './ImageViewer';
import Pagination from './Pagination';
import { parseTEI } from '../services/xmlParser';
import { usePagination } from '../hooks/usePagination';
import './App.css';

/**
 * Main application component
 */
export default function App() {
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    currentPage,
    totalPages,
    currentPageData,
    nextPage,
    prevPage,
    goToPage,
    isFirstPage,
    isLastPage
  } = usePagination(documentData?.pages || []);

  // Load TEI document on startup
  useEffect(() => {
    async function loadDocument() {
      try {
        setLoading(true);
        setError(null);

        // Load sample TEI file
        // To use the full manuscript, download images and change to:
        // const data = await parseTEI('/sample-data/hou02614c00333_tei.xml');
        const data = await parseTEI('/sample-data/sample.xml');
        setDocumentData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Unable to load TEI document. Please verify that sample.xml exists.');
        setLoading(false);
      }
    }

    loadDocument();
  }, []);

  if (loading) {
    return (
      <div className="app loading-state">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app error-state">
        <div className="error-content">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
            <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
          </svg>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">TEI-IIIF Viewer</h1>
          {documentData?.metadata?.title && (
            <p className="document-title">{documentData.metadata.title}</p>
          )}
        </div>
        {documentData?.metadata?.author && (
          <div className="document-meta">
            <span className="meta-label">Author:</span>
            <span className="meta-value">{documentData.metadata.author}</span>
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="split-view">
          <div className="panel left-panel">
            <XMLViewer pageData={currentPageData} />
          </div>

          <div className="panel right-panel">
            <ImageViewer
              imageId={currentPageData?.facsUrl}
              pageNumber={currentPageData?.pageNumber}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onGoToPage={goToPage}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
        />
        <div className="copyright">
          © 2026 Carlo Teo Pedretti - Bibliotheca Hertziana - Max Planck Institute for Art History
        </div>
      </footer>
    </div>
  );
}
