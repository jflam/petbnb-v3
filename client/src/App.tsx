import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { User, SearchParams } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';

// Mock user for demo purposes
const mockUser: User = {
  id: 7,
  firstName: 'Jane',
  email: 'jane@example.com',
  role: 'owner',
  verified: true
};

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse search params from URL
  const getSearchParamsFromUrl = (): SearchParams => {
    return {
      city: searchParams.get('city') || undefined,
      petType: (searchParams.get('petType') as 'dog' | 'cat' | 'other') || 'dog',
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
      sort: (searchParams.get('sort') as SearchParams['sort']) || 'relevance',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1
    };
  };

  // Handle search submission
  const handleSearch = (params: SearchParams) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    navigate(`/search?${queryParams.toString()}`);
  };

  // Handle search param changes in the search page
  const handleSearchParamsChange = (params: SearchParams) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    setSearchParams(queryParams);
  };

  // Mock login/logout
  const handleLogin = () => {
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="app-container">
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      
      <main>
        <Routes>
          <Route 
            path="/" 
            element={<HomePage user={user} onSearch={handleSearch} />} 
          />
          <Route 
            path="/search" 
            element={
              <SearchPage 
                initialParams={getSearchParamsFromUrl()} 
                onParamsChange={handleSearchParamsChange} 
              />
            } 
          />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
