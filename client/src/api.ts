import { Listing, SearchParams, SearchResponse } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function fetchFeaturedListings(): Promise<Listing[]> {
  const response = await fetch(`${API_URL}/homepage/featured`);
  if (!response.ok) {
    throw new Error('Failed to fetch featured listings');
  }
  return response.json();
}

export async function fetchRecommendations(userId: number): Promise<Listing[]> {
  const response = await fetch(`${API_URL}/homepage/recommendations?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }
  return response.json();
}

export async function searchListings(params: SearchParams): Promise<SearchResponse> {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(`${API_URL}/search?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Search failed');
  }
  return response.json();
}