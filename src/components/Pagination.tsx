import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageWindow?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageWindow = 10,
  onPageChange,
}) => {
  const startPage = Math.floor((currentPage - 1) / pageWindow) * pageWindow + 1;
  const endPage = Math.min(startPage + pageWindow - 1, totalPages);

  const darkColor = '#222';
  const activeColor = '#ffaa00';

  return (
    <div style={{
    marginTop: '30px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    padding: '0 16px',
    maxWidth: '100%',
    boxSizing: 'border-box',
  }}>
       <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        style={{
            marginRight: 10,
            padding: '6px 12px',
            backgroundColor: darkColor,
            color: '#ccc',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
            }}>
        First
      </button>
      <button
        disabled={currentPage - pageWindow < 1}
        onClick={() => onPageChange(currentPage - pageWindow)}
        style={{
            marginRight: 10,
            padding: '6px 12px',
            backgroundColor: darkColor,
            color: '#ccc',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
            }}>
        -{pageWindow}
      </button>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          marginRight: 10,
          padding: '6px 12px',
          backgroundColor: darkColor,
          color: '#ccc',
          border: '1px solid #555',
          borderRadius: '4px',
          cursor: 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        Prev
      </button>
      

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
        const pageNumber = startPage + i;
        const isActive = currentPage === pageNumber;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            style={{
              margin: '0 4px',
              padding: '6px 12px',
              backgroundColor: isActive
                ? activeColor
                : darkColor,
              color: isActive
                ? 'white'
                : '#ccc',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: isActive ? 'bold' : 'normal',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
            marginLeft: 10,
            padding: '6px 12px',
            backgroundColor: darkColor,
            color: '#ccc',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
        }}
      >
        Next
      </button>
      <button
        disabled={currentPage + pageWindow > totalPages}
        onClick={() => onPageChange(currentPage + pageWindow)}
        style={{
            marginLeft: 10,
            padding: '6px 12px',
            backgroundColor: darkColor,
            color: '#ccc',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
        }}>
        +{pageWindow}
      </button>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        style={{
            marginLeft: 10,
            padding: '6px 12px',
            backgroundColor: darkColor,
            color: '#ccc',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
        }}>
        Last
      </button>
    </div>
  );
};

export default Pagination;
