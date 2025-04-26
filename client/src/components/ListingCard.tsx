import React from 'react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps): React.ReactElement {
  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  return (
    <div className="listing-card">
      <img 
        src={listing.heroImageUrl || 'https://via.placeholder.com/300x180?text=No+Image'} 
        alt={listing.title}
        className="listing-image"
      />
      <div className="listing-info">
        <h3 className="listing-title">{listing.title}</h3>
        <div className="listing-meta">
          <span className="listing-city">{listing.city}</span>
          <span className="listing-rating">{listing.rating.toFixed(1)}★</span>
        </div>
        <div className="listing-price">
          {formatPrice(listing.nightlyPriceCents)} / night
        </div>
      </div>
    </div>
  );
}