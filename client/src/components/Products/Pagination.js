// import React from 'react';

// function Pagination({ totalPages, currentPage, onPageChange }) {
//   const renderPaginationItems = () => {
//     const items = [];
//     for (let i = 1; i <= totalPages; i++) {
//       items.push(
//         <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
//           <a
//             className="page-link"
//             href="#"
//             onClick={() => onPageChange(i)}
//           >
//             {i}
//           </a>
//         </li>
//       );
//     }
//     return items;
//   };

//   return (
//     <nav aria-label="Page navigation">
//       <ul className="pagination">
//         <li className="page-item">
//           <a
//             className="page-link"
//             href="#"
//             onClick={() => onPageChange(currentPage - 1)}
//             aria-label="Previous"
//           >
//             <span aria-hidden="true">&laquo;</span>
//           </a>
//         </li>
//         {renderPaginationItems()}
//         <li className="page-item">
//           <a
//             className="page-link"
//             href="#"
//             onClick={() => onPageChange(currentPage + 1)}
//             aria-label="Next"
//           >
//             <span aria-hidden="true">&raquo;</span>
//           </a>
//         </li>
//       </ul>
//     </nav>
//   );
// }

// export default Pagination;

import React from 'react';

function Pagination({ totalPages, currentPage, onPageChange }) {
  const renderPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
        >
          <a className="page-link" href="#" onClick={() => onPageChange(i)}>
            {i}
          </a>
        </li>
      );
    }
    return items;
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a
            className="page-link"
            href="#"
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {renderPaginationItems()}
        <li
          className={`page-item ${
            currentPage === totalPages ? 'disabled' : ''
          }`}
        >
          <a
            className="page-link"
            href="#"
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
