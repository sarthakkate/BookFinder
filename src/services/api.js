export const searchBooks = async (query) => {
  const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
};