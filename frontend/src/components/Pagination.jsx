import { useState } from 'react';
import './Pagination.css';

/**
 * Component for pagination controls
 */
export default function Pagination({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  onGoToPage,
  isFirstPage,
  isLastPage
}) {
  const [jumpToPage, setJumpToPage] = useState('');

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onGoToPage(pageNum);
      setJumpToPage('');
    }
  };

  const handleInputChange = (e) => {
    setJumpToPage(e.target.value);
  };

  if (totalPages === 0) {
    return (
      <div className="pagination">
        <div className="pagination-info">
          No pages available
        </div>
      </div>
    );
  }

  return (
    <div className="pagination">
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={onPrevPage}
          disabled={isFirstPage}
          title="Previous page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15 18 9 12 15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Previous
        </button>

        <div className="pagination-info">
          <span className="current-page">{currentPage}</span>
          <span className="separator">/</span>
          <span className="total-pages">{totalPages}</span>
        </div>

        <button
          className="pagination-button"
          onClick={onNextPage}
          disabled={isLastPage}
          title="Next page"
        >
          Next
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="9 18 15 12 9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <form className="jump-to-page" onSubmit={handleJumpSubmit}>
        <label htmlFor="page-jump">Go to page:</label>
        <input
          id="page-jump"
          type="number"
          min="1"
          max={totalPages}
          value={jumpToPage}
          onChange={handleInputChange}
          placeholder={`1-${totalPages}`}
          className="page-input"
        />
        <button type="submit" className="jump-button" disabled={!jumpToPage}>
          Go
        </button>
      </form>
    </div>
  );
}
