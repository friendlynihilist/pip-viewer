import { useEffect, useRef } from 'react';
import './InfoModal.css';

/**
 * Modal component for displaying metadata
 */
export default function InfoModal({ isOpen, onClose, title, metadata }) {
  const modalRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Close on click outside
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="info-modal-backdrop" ref={modalRef} onClick={handleBackdropClick}>
      <div className="info-modal">
        <div className="info-modal-header">
          <h2>{title}</h2>
          <button className="info-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="info-modal-content">
          {metadata && Object.keys(metadata).length > 0 ? (
            <dl className="metadata-list">
              {Object.entries(metadata).map(([key, value]) => {
                // Skip empty values
                if (!value || (Array.isArray(value) && value.length === 0)) {
                  return null;
                }

                return (
                  <div key={key} className="metadata-item">
                    <dt>{formatKey(key)}</dt>
                    <dd>{formatValue(value)}</dd>
                  </div>
                );
              })}
            </dl>
          ) : (
            <p className="no-metadata">No metadata available</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Format metadata key for display
 */
function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Format metadata value for display
 */
function formatValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  if (typeof value === 'string' && value.startsWith('http')) {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer">
        {value}
      </a>
    );
  }
  return value;
}
