import { useState, useEffect, useCallback } from 'react';

/**
 * Hook per la gestione della paginazione
 * @param {Array} pages - Array di pagine dal parser TEI
 * @returns {Object} - Oggetto con stato e funzioni di paginazione
 */
export function usePagination(pages = []) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pages.length;

  // Reset currentPage quando cambiano le pagine
  useEffect(() => {
    if (pages.length > 0 && currentPage > pages.length) {
      setCurrentPage(1);
    }
  }, [pages, currentPage]);

  // Vai alla pagina successiva
  const nextPage = useCallback(() => {
    setCurrentPage(prev => {
      if (prev < totalPages) {
        return prev + 1;
      }
      return prev;
    });
  }, [totalPages]);

  // Vai alla pagina precedente
  const prevPage = useCallback(() => {
    setCurrentPage(prev => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  // Vai a una pagina specifica
  const goToPage = useCallback((pageNumber) => {
    const pageNum = parseInt(pageNumber, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  }, [totalPages]);

  // Ottieni i dati della pagina corrente
  const currentPageData = pages[currentPage - 1] || null;

  // Check se siamo alla prima/ultima pagina
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  return {
    currentPage,
    totalPages,
    currentPageData,
    nextPage,
    prevPage,
    goToPage,
    isFirstPage,
    isLastPage
  };
}
