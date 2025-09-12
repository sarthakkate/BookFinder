import React from 'react';
import './bookcard.css';

const BookCard = ({ book }) => {
  const coverId = book.cover_i;
  const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://placehold.co/128x193/9CA3AF/FFFFFF?text=No+Cover';
  const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';

  return (
    <div className="book-card">
      <img
        src={coverUrl}
        alt={`Cover of ${book.title}`}
        className="book-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x193/9CA3AF/FFFFFF?text=No+Cover'; }}
      />
      <div className="book-details">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {author}</p>
      </div>
    </div>
  );
};

export default BookCard;