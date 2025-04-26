import React from 'react';
import { User, SearchParams } from '../types';
import HeroSearch from '../components/HeroSearch';
import FeaturedGrid from '../components/FeaturedGrid';
import RecommendationsCarousel from '../components/RecommendationsCarousel';

interface HomePageProps {
  user: User | null;
  onSearch: (params: SearchParams) => void;
}

export default function HomePage({ user, onSearch }: HomePageProps): React.ReactElement {
  return (
    <div>
      {user ? (
        <div className="authenticated-home">
          <section className="hero">
            <h1>Welcome back, {user.firstName}</h1>
            <HeroSearch onSubmit={onSearch} />
          </section>
          <RecommendationsCarousel user={user} />
        </div>
      ) : (
        <div className="anonymous-home">
          <section className="hero">
            <h1>Find a trusted dog sitter</h1>
            <HeroSearch onSubmit={onSearch} />
          </section>
          <FeaturedGrid />
        </div>
      )}
    </div>
  );
}