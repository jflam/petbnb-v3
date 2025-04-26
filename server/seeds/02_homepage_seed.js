/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async (knex) => {
  // First clear all tables
  await knex('reviews').del();
  await knex('bookings').del();
  await knex('availability').del();
  await knex('listings').del();
  await knex('users').del();

  // Insert users
  await knex('users').insert([
    { id: 1, first_name: 'Alice', email: 'alice@example.com', role: 'sitter', verified: true },
    { id: 2, first_name: 'Bob', email: 'bob@example.com', role: 'sitter', verified: true },
    { id: 3, first_name: 'Carol', email: 'carol@example.com', role: 'sitter', verified: true },
    { id: 4, first_name: 'Dan', email: 'dan@example.com', role: 'sitter', verified: true },
    { id: 5, first_name: 'Eve', email: 'eve@example.com', role: 'sitter', verified: true },
    { id: 6, first_name: 'Frank', email: 'frank@example.com', role: 'sitter', verified: true },
    { id: 7, first_name: 'Jane', email: 'jane@example.com', role: 'owner', verified: true },
    { id: 8, first_name: 'Omar', email: 'omar@example.com', role: 'owner', verified: false }
  ]);

  // Insert listings (all with pet_type = 'dog')
  await knex('listings').insert([
    { 
      id: 10, 
      sitter_id: 1, 
      title: "Alice's Dog Boarding", 
      nightly_price_cents: 3000, 
      rating: 4.9, 
      pet_type: 'dog', 
      city: 'Seattle', 
      lat: 47.6062, 
      lng: -122.332,
      hero_image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400' 
    },
    { 
      id: 11, 
      sitter_id: 2, 
      title: "Bob's Dog Paradise", 
      nightly_price_cents: 2000, 
      rating: 4.7, 
      pet_type: 'dog', 
      city: 'Seattle', 
      lat: 47.6062, 
      lng: -122.332,
      hero_image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=400' 
    },
    { 
      id: 12, 
      sitter_id: 3, 
      title: "Carol's Canine Care", 
      nightly_price_cents: 2500, 
      rating: 4.95, 
      pet_type: 'dog', 
      city: 'Austin', 
      lat: 30.2672, 
      lng: -97.743,
      hero_image_url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=400' 
    },
    { 
      id: 13, 
      sitter_id: 4, 
      title: "Dan's Dog Den", 
      nightly_price_cents: 2700, 
      rating: 4.85, 
      pet_type: 'dog', 
      city: 'Austin', 
      lat: 30.2672, 
      lng: -97.743,
      hero_image_url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=400' 
    },
    { 
      id: 14, 
      sitter_id: 5, 
      title: "Eve's Pet Emporium", 
      nightly_price_cents: 2900, 
      rating: 4.9, 
      pet_type: 'dog', 
      city: 'Austin', 
      lat: 30.2672, 
      lng: -97.743,
      hero_image_url: 'https://images.unsplash.com/photo-1583511655826-05700a52f8e6?q=80&w=400' 
    },
    { 
      id: 15, 
      sitter_id: 6, 
      title: "Frank's Furry Friends", 
      nightly_price_cents: 3100, 
      rating: 4.88, 
      pet_type: 'dog', 
      city: 'Austin', 
      lat: 30.2672, 
      lng: -97.743,
      hero_image_url: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=400' 
    }
  ]);

  // Insert availability
  await knex('availability').insert([
    { id: 100, listing_id: 10, start_date: '2023-06-01', end_date: '2023-06-05' },
    { id: 101, listing_id: 11, start_date: '2023-06-10', end_date: '2023-06-15' }
  ]);

  // Insert bookings
  await knex('bookings').insert([
    { 
      id: 200, 
      listing_id: 10, 
      owner_id: 8, 
      state: 'confirmed', 
      start_date: '2023-07-10', 
      end_date: '2023-07-12' 
    }
  ]);
};