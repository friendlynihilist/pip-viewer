import { useEffect, useRef, useState } from 'react';
import './XMLViewer.css';

/**
 * Transforms TEI/XML content into viewable HTML
 * @param {string} xmlContent - XML content as string
 * @returns {string} - Transformed HTML
 */
function transformTEItoHTML(xmlContent) {
  if (!xmlContent) {
    return '<p class="empty-message">No content available for this page.</p>';
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<root>${xmlContent}</root>`, 'text/xml');

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return `<p class="error-message">Error parsing XML</p>`;
    }

    // Recursively transform TEI nodes to HTML
    function transformNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }

      const tagName = node.tagName.toLowerCase();
      let html = '';

      // TEI tag -> HTML map
      const tagMap = {
        'p': 'p',
        'head': 'h3',
        'div': 'div',
        'lg': 'div',
        'l': 'div',
        'ab': 'p',
        'seg': 'span',
        'quote': 'blockquote',
        'list': 'ul',
        'item': 'li',
        'note': 'aside',
        'foreign': 'em',
        'emph': 'em',
        'title': 'cite',
        'name': 'span',
        'date': 'time',
        'hi': 'span',
        'del': 'del',
        'add': 'sup',
        'unclear': 'span'
      };

      // Tags that cause line breaks
      if (tagName === 'lb') {
        return '<br/>';
      }

      // Page break tag - usually already processed, ignore if present
      if (tagName === 'pb') {
        return '';
      }

      // Determine which HTML tag to use
      const htmlTag = tagMap[tagName] || 'span';

      // Handle special attributes
      let className = '';
      let inlineStyle = '';
      const rendAttr = node.getAttribute('rend');
      const styleAttr = node.getAttribute('style');

      if (tagName === 'hi' && rendAttr) {
        if (rendAttr === 'italic' || rendAttr === 'italics') {
          return `<em>${transformChildren(node)}</em>`;
        } else if (rendAttr === 'bold') {
          return `<strong>${transformChildren(node)}</strong>`;
        } else if (rendAttr === 'underline') {
          // Handle colored underlines
          const content = transformChildren(node);
          if (styleAttr) {
            // Extract color from style attribute
            const colorMatch = styleAttr.match(/color:\s*([^;]+)/);
            if (colorMatch) {
              const color = colorMatch[1].trim();
              return `<u class="tei-underline-colored" style="text-decoration-color: ${color};">${content}</u>`;
            }
          }
          return `<u class="tei-underline">${content}</u>`;
        } else if (rendAttr === 'encircled') {
          return `<span class="tei-encircled">${transformChildren(node)}</span>`;
        } else if (rendAttr === 'boxed') {
          return `<span class="tei-boxed">${transformChildren(node)}</span>`;
        }
        className = `rend-${rendAttr}`;
      }

      // Add class for TEI element type
      className = className ? `${className} tei-${tagName}` : `tei-${tagName}`;

      // Transform children
      const content = transformChildren(node);

      html = `<${htmlTag} class="${className}">${content}</${htmlTag}>`;

      return html;
    }

    function transformChildren(node) {
      let result = '';
      for (const child of node.childNodes) {
        result += transformNode(child);
      }
      return result;
    }

    const rootNode = doc.documentElement;
    return transformChildren(rootNode);
  } catch (error) {
    console.error('Error in TEI->HTML transformation:', error);
    return '<p class="error-message">Error displaying content</p>';
  }
}

/**
 * Component for displaying TEI/XML text
 */
export default function XMLViewer({ pageData }) {
  const contentRef = useRef(null);
  const [viewMode, setViewMode] = useState('diplomatic'); // 'diplomatic' or 'reading'

  useEffect(() => {
    if (contentRef.current && pageData) {
      const htmlContent = transformTEItoHTML(pageData.xmlContent);
      contentRef.current.innerHTML = htmlContent;

      // Scroll to top when page changes
      contentRef.current.scrollTop = 0;
    }
  }, [pageData]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'diplomatic' ? 'reading' : 'diplomatic');
  };

  if (!pageData) {
    return (
      <div className="xml-viewer">
        <div className="xml-content empty">
          <p className="empty-message">No page selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="xml-viewer">
      <div className="page-info">
        <span className="page-number">Page {pageData.pageNumber}</span>
        <button
          className="view-toggle"
          onClick={toggleViewMode}
          title={viewMode === 'diplomatic' ? 'Switch to Reading View' : 'Switch to Diplomatic View'}
        >
          {viewMode === 'diplomatic' ? 'Reading View' : 'Diplomatic View'}
        </button>
      </div>
      <div
        className={`xml-content ${viewMode === 'reading' ? 'reading-view' : ''}`}
        ref={contentRef}
      >
        {/* Content will be inserted via innerHTML */}
      </div>
    </div>
  );
}
