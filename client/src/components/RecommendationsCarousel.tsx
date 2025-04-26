import React, { useState, useEffect } from 'react';
import { User, Listing } from '../types';
import { fetchRecommendations } from '../api';
import ListingCard from './ListingCard';

interface RecommendationsCarouselProps {
  user: User;
}

export default function RecommendationsCarousel({ user }: RecommendationsCarouselProps): React.ReactElement {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const data = await fetchRecommendations(user.id);
        setListings(data);
        setError(null);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [user.id]);

  if (loading) {
    return <div className="loading">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="section">
      <h2 className="section-title">Sitters You'll Love</h2>
      <div className="listings-grid">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}