import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard/BookCard';
import { searchBooks } from '../services/api';
import './homepage.css';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Simple cache implementation
  const [searchCache, setSearchCache] = useState(new Map());

  // Debounce logic
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Fetch books when debounced term changes
  useEffect(() => {
    const fetchBooks = async () => {
      if (!debouncedSearchTerm.trim()) {
        setBooks([]);
        return;
      }
      
      // Check cache first
      if (searchCache.has(debouncedSearchTerm)) {
        setBooks(searchCache.get(debouncedSearchTerm));
        return;
      }
      
      setLoading(true);
      setError(null);
      setBooks([]);

      try {
        const data = await searchBooks(debouncedSearchTerm);
        if (data.docs && data.docs.length > 0) {
          const limitedResults = data.docs.slice(0, 20); // Limit to 20 results
          setBooks(limitedResults);
          // Update cache
          setSearchCache(prev => new Map(prev).set(debouncedSearchTerm, limitedResults));
        } else {
          setError('No books found. Please try a different search term.');
        }
      } catch (err) {
        setError('Failed to fetch books. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearchTerm, searchCache]);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setDebouncedSearchTerm(searchTerm);
    }
  };

  return (
    <div className="homepage-container">
      <header className="header">
        <div className="logo">BookFinder</div>
        
      </header>
      
      <section className="hero">
        <h1>Find Your Next Great Read</h1>
        <p>Discover millions of books from libraries worldwide. Perfect for students, researchers, and book lovers.</p>
        
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !searchTerm.trim()}
          >
            {loading ? 'Searching...' : 'Search Books'}
          </button>
        </form>
        
        <div className="suggestions">
          Try: 
          <span className="suggestion-link" onClick={() => handleSuggestionClick('Harry Potter')}>Harry Potter</span>
          <span className="suggestion-link" onClick={() => handleSuggestionClick('To Kill a Mockingbird')}>To Kill a Mockingbird</span>
          <span className="suggestion-link" onClick={() => handleSuggestionClick('The Great Gatsby')}>The Great Gatsby</span>
          <span className="suggestion-link" onClick={() => handleSuggestionClick('1984')}>1984</span>
        </div>
      </section>
      
      <main className="main-content">
        {loading && <div className="loading">Searching for books...</div>}
        
        {error && <div className="error-message">{error}</div>}
        
        {books.length > 0 && (
          <div className="book-list">
            {books.map((book) => (
              <BookCard key={book.key} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;