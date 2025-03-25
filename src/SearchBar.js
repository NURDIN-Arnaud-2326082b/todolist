import React from 'react';

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Rechercher une tâche..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {searchQuery && (
        <button 
          className="clear-search" 
          onClick={() => setSearchQuery('')}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;