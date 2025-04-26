import React, { useState, useEffect } from 'react';
import { SearchParams, Listing } from '../types';
import { searchListings } from '../api';
import ListingCard from '../components/ListingCard';

interface SearchPageProps {
  initialParams: SearchParams;
  onParamsChange: (params: SearchParams) => void;
}

export default function SearchPage({ initialParams, onParamsChange }: SearchPageProps): React.ReactElement {
  const [params, setParams] = useState<SearchParams>(initialParams);
  const [results, setResults] = useState<{
    listings: Listing[];
    total: number;
    page: number;
    pageSize: number;
  }>({ listings: [], total: 0, page: 1, pageSize: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load search results
  useEffect(() => {
    const loadSearchResults = async () => {
      try {
        setLoading(true);
        const data = await searchListings(params);
        setResults(data);
        setError(null);
      } catch (err) {
        setError('Search failed. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [params]);

  // Update filter parameters
  const updateParams = (newParams: Partial<SearchParams>) => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);
    onParamsChange(updatedParams);
  };

  // Calculate total pages
  const totalPages = Math.ceil(results.total / results.pageSize);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    window.scrollTo(0, 0);
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ sort: e.target.value as SearchParams['sort'] });
  };

  // Handle price filter change
  const handlePriceChange = (min: number, max: number) => {
    updateParams({ priceMin: min, priceMax: max });
  };

  // Handle rating filter change
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ rating: Number(e.target.value) });
  };

  return (
    <div className="search-page">
      {/* Filters sidebar */}
      <aside className="filters-sidebar">
        <h2>Filters</h2>
        
        {/* Sort dropdown */}
        <div className="sort-dropdown">
          <label htmlFor="sort" className="filter-label">Sort by</label>
          <select 
            id="sort" 
            value={params.sort || 'relevance'} 
            onChange={handleSortChange}
            className="search-input"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="rating_desc">Rating: High to Low</option>
          </select>
        </div>
        
        {/* Price filter */}
        <div className="filter-group">
          <label className="filter-label">Price Range</label>
          <input 
            type="range" 
            min="1000" 
            max="5000" 
            step="500" 
            value={params.priceMax || 5000}
            onChange={(e) => handlePriceChange(params.priceMin || 1000, Number(e.target.value))}
            className="range-input"
          />
          <div className="range-values">
            <span>Up to ${((params.priceMax || 5000) / 100).toFixed(0)}</span>
          </div>
        </div>
        
        {/* Rating filter */}
        <div className="filter-group">
          <label className="filter-label">Min Rating</label>
          <input 
            type="range" 
            min="3" 
            max="5" 
            step="0.5" 
            value={params.rating || 3}
            onChange={handleRatingChange}
            className="range-input"
          />
          <div className="range-values">
            <span>{params.rating || 3}+ stars</span>
          </div>
        </div>
      </aside>
      
      {/* Search results */}
      <div className="search-results">
        <div className="results-header">
          <h2>Dog Sitters in {params.city || 'All Cities'}</h2>
          <p>{results.total} sitters available</p>
        </div>
        
        {loading && <div className="loading">Loading listings...</div>}
        
        {error && <div className="error">{error}</div>}
        
        {!loading && !error && (
          <>
            {results.listings.length === 0 ? (
              <div className="no-results">
                <p>No sitters found matching your criteria.</p>
              </div>
            ) : (
              <div className="listings-grid">
                {results.listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-button ${page === results.page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}