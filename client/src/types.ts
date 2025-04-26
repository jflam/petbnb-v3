export interface Listing {
  id: number;
  title: string;
  nightlyPriceCents: number;
  rating: number;
  city: string;
  heroImageUrl: string | null;
}

export interface SearchParams {
  city?: string;
  petType?: 'dog' | 'cat' | 'other';
  startDate?: string;
  endDate?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  sort?: 'relevance' | 'price_asc' | 'rating_desc';
  page?: number;
}

export interface User {
  id: number;
  firstName: string;
  email: string;
  role: 'owner' | 'sitter';
  verified: boolean;
}

export interface SearchResponse {
  total: number;
  page: number;
  pageSize: number;
  listings: Listing[];
}