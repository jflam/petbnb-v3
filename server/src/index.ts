import express from 'express';
import cors from 'cors';
import db from './db';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Types for our API
interface ListingResponse {
  id: number;
  title: string;
  nightlyPriceCents: number;
  rating: number;
  city: string;
  heroImageUrl: string | null;
}

// Homepage featured listings
app.get('/api/homepage/featured', async (_req, res) => {
  try {
    // Find 75th percentile price among dog listings
    const priceResult = await db('listings')
      .where({ pet_type: 'dog' })
      .orderBy('nightly_price_cents', 'asc');
    
    const percentile75Index = Math.floor(priceResult.length * 0.75);
    const priceThreshold = priceResult[percentile75Index]?.nightly_price_cents || 3000;
    
    // Get featured listings: rating >= 4.8 AND price <= 75th percentile
    const listings = await db('listings')
      .where({ pet_type: 'dog' })
      .where('rating', '>=', 4.8)
      .where('nightly_price_cents', '<=', priceThreshold)
      .limit(6)
      .select(
        'id', 
        'title', 
        'nightly_price_cents as nightlyPriceCents', 
        'rating', 
        'city', 
        'hero_image_url as heroImageUrl'
      );
      
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Homepage personalized recommendations
app.get('/api/homepage/recommendations', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Get listings from previous bookings
    const previousListings = await db('bookings')
      .join('listings', 'bookings.listing_id', 'listings.id')
      .where('bookings.owner_id', userId)
      .select('listings.id')
      .distinct();
    
    const previousListingIds = previousListings.map(listing => listing.id);
    
    // Get top listings including previous ones
    const recommendations = await db('listings')
      .where({ pet_type: 'dog' })
      .orderByRaw(
        previousListingIds.length > 0 
          ? `CASE WHEN id IN (${previousListingIds.join(',')}) THEN 0 ELSE 1 END, rating DESC` 
          : 'rating DESC'
      )
      .limit(6)
      .select(
        'id', 
        'title', 
        'nightly_price_cents as nightlyPriceCents', 
        'rating', 
        'city', 
        'hero_image_url as heroImageUrl'
      );
      
    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { city, petType = 'dog', startDate, endDate, priceMin, priceMax, rating, sort = 'relevance', page = 1 } = req.query;
    const pageSize = 20;
    const offset = (Number(page) - 1) * pageSize;
    
    let query = db('listings')
      .where({ pet_type: petType });
    
    // Apply city filter
    if (city) {
      query = query.where('city', 'like', `%${city}%`);
    }
    
    // Apply price filters
    if (priceMin) {
      query = query.where('nightly_price_cents', '>=', Number(priceMin));
    }
    
    if (priceMax) {
      query = query.where('nightly_price_cents', '<=', Number(priceMax));
    }
    
    // Apply rating filter
    if (rating) {
      query = query.where('rating', '>=', Number(rating));
    }
    
    // Apply date range filter
    if (startDate && endDate) {
      query = query.whereExists(function() {
        this.select('id')
          .from('availability')
          .whereRaw('availability.listing_id = listings.id')
          .where('start_date', '<=', startDate)
          .where('end_date', '>=', endDate);
      });
      
      // Exclude listings with confirmed bookings in this date range
      query = query.whereNotExists(function() {
        this.select('id')
          .from('bookings')
          .whereRaw('bookings.listing_id = listings.id')
          .where('state', 'confirmed')
          .where(function() {
            this.where(function() {
              this.where('start_date', '<=', startDate)
                .where('end_date', '>=', startDate);
            }).orWhere(function() {
              this.where('start_date', '<=', endDate)
                .where('end_date', '>=', endDate);
            }).orWhere(function() {
              this.where('start_date', '>=', startDate)
                .where('end_date', '<=', endDate);
            });
          });
      });
    }
    
    // Apply sorting
    switch (sort) {
      case 'price_asc':
        query = query.orderBy('nightly_price_cents', 'asc');
        break;
      case 'rating_desc':
        query = query.orderBy('rating', 'desc');
        break;
      default: // relevance
        query = query.orderByRaw('rating * 1000 / nightly_price_cents DESC');
    }
    
    // Get total count for pagination
    const countResult = await query.clone().count('id as total').first();
    const total = countResult ? Number(countResult.total) : 0;
    
    // Get paginated results
    const listings = await query
      .offset(offset)
      .limit(pageSize)
      .select(
        'id', 
        'title', 
        'nightly_price_cents as nightlyPriceCents', 
        'rating', 
        'city', 
        'hero_image_url as heroImageUrl'
      );
      
    res.json({
      total,
      page: Number(page),
      pageSize,
      listings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Keep the fortune endpoint for backward compatibility
app.get('/api/fortunes/random', async (_req, res) => {
  try {
    const fortune = await db<{ id: number; text: string }>('fortunes')
      .orderByRaw('RANDOM()')
      .first();
    if (!fortune) return res.status(404).json({ error: 'No fortunes found.' });
    res.json(fortune);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`🏠 PetBnB API listening at http://localhost:${PORT}`);
});
