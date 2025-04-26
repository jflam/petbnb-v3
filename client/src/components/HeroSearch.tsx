import React, { useState } from 'react';
import { SearchParams } from '../types';

interface HeroSearchProps {
  onSubmit: (params: SearchParams) => void;
  initialValues?: Partial<SearchParams>;
}

export default function HeroSearch({ onSubmit, initialValues = {} }: HeroSearchProps): React.ReactElement {
  const [city, setCity] = useState(initialValues.city || '');
  const [startDate, setStartDate] = useState(initialValues.startDate || '');
  const [endDate, setEndDate] = useState(initialValues.endDate || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      city,
      petType: 'dog', // Fixed as 'dog' per the spec
      startDate,
      endDate
    });
  };
  
  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Enter city or ZIP"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        aria-label="City or ZIP code"
      />
      <input
        type="date"
        className="date-input"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        aria-label="Start date"
      />
      <input
        type="date"
        className="date-input"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        aria-label="End date"
      />
      <button type="submit" className="btn">
        Search Dog Sitters
      </button>
    </form>
  );
}