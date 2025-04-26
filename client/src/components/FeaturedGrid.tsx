import React, { useState, useEffect } from 'react';
import { Listing } from '../types';
import { fetchFeaturedListings } from '../api';
import ListingCard from './ListingCard';

export default function FeaturedGrid(): React.ReactElement {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedListings = async () => {
      try {
        setLoading(true);
        const data = await fetchFeaturedListings();
        setListings(data);
        setError(null);
      } catch (err) {
        setError('Failed to load featured listings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedListings();
  }, []);

  if (loading) {
    return <div className="loading">Loading featured listings...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="section">
      <h2 className="section-title">Featured Dog Sitters</h2>
      <div className="listings-grid">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}