# Homepage Feature – Implementation Plan

## 1. Overview
Replace the “fortune” placeholder with the real PetBnB domain.  
The homepage serves two jobs:  
1. Dog‑focused hero that instantly routes to search.  
2. Personalized carousel / featured sitters surface.

## 2. Back‑end

### 2.1 Database schema (SQLite + Knex)
```
users(id PK, first_name, email, role ENUM[owner,sitter], verified BOOL)
listings(
  id PK,
  sitter_id FK->users(id),
  title,
  nightly_price_cents,
  rating,
  pet_type ENUM[dog,cat,other],
  city TEXT,
  lat REAL,
  lng REAL,
  hero_image_url TEXT
)
availability(id PK, listing_id FK->listings(id), start_date, end_date)
bookings(id PK, listing_id FK, owner_id FK->users(id), state ENUM[requested,confirmed,completed,cancelled], start_date, end_date)
reviews(id PK, booking_id FK, author_id FK->users(id), rating, comment, created_at)
```

### 2.2 REST endpoints
| Verb | Path | Purpose | Response |
| ---- | ---- | ------- | -------- |
| GET  | `/homepage/featured` | 6 top dog listings | `[{ id, title, nightlyPriceCents, rating, city, heroImageUrl }]` |
| GET  | `/homepage/recommendations` | 6 personalised listings | same as above |
| GET  | `/search` | city, start, end, priceMin/Max, rating, sort | `{ total, page, pageSize, listings: [...] }` |

### 2.3 Services / Rules
* Search service enforces H6‑H10.  
* Booking service validates date collisions (Scenario “Overlapping booking rejected”).  
* Featured algorithm: rating ≥ 4.8 AND nightly_price_cents ≤ 75th percentile among dog listings.

## 3. Front‑end (React + Vite)

```
+------------------------------------------------------------------------------+
|                               [   search   ]                                 |
|                                                                              |
|  +-----------+   +---------+   +---------+                                   |
|  |  FILTERS  |   |         |   |         |                                   |
|  |           |   | listings|   |         |                                   |
|  +-----------+   +---------+   +---------+                                   |
+------------------------------------------------------------------------------+
```

• <AppRouter> – React‑Router setup (“/”, “/search”)  
• <Header>, <Footer> – site‑wide chrome  
• <HeroSearch props={onSubmit}> – auto‑complete, date pickers, defaults petType="dog"  
• <FeaturedGrid> – fetches `/homepage/featured`, renders six <ListingCard>  
• <RecommendationsCarousel> – requires `auth.user`, fetches `/homepage/recommendations`  
• <FiltersSidebar>, <SortDropdown>, <Pagination> – consumed by <SearchResultsPage>  
• <ListingCard props={listing}> – image, price/night, rating badge  

Each component lists **props**, events, and any **context** it consumes.

## 4. Testing

### 4.1 Playwright
* `homepage.spec.ts` – validates anonymous & auth flows, redirect query‑string.  
* `search_filters.spec.ts` – date filter + price sort.  
* `booking_conflict.spec.ts` – overlapping booking rejection.

### 4.2 Unit tests (Jest)
* Search service returns correct filtered & sorted IDs.  
* Booking service prevents overlaps.

## 5. Seed Data (seeds/02_homepage_seed.js)

Seed the minimal rows required for every scenario + 6 featured sitters.

### 5.1 Users
| id | first_name | role   | verified |
| -- | ---------- | ------ | -------- |
| 1  | Alice      | sitter | true  |
| 2  | Bob        | sitter | true  |
| 3  | Carol      | sitter | true  |
| 4  | Dan        | sitter | true  |
| 5  | Eve        | sitter | true  |
| 6  | Frank      | sitter | true  |
| 7  | Jane       | owner  | true  |
| 8  | Omar       | owner  | false |

### 5.2 Listings  (all `pet_type = 'dog'`)
| id | sitter_id | nightly_price_cents | rating | city      | lat      | lng      |
| -- | --------- | ------------------- | ------ | --------- | -------- | -------- |
| 10 | 1         | 3000                | 4.9    | Seattle   | 47.6062  | -122.332 |
| 11 | 2         | 2000                | 4.7    | Seattle   | 47.6062  | -122.332 |
| 12 | 3         | 2500                | 4.95   | Austin    | 30.2672  |  -97.743 |
| 13 | 4         | 2700                | 4.85   | Austin    | 30.2672  |  -97.743 |
| 14 | 5         | 2900                | 4.9    | Austin    | 30.2672  |  -97.743 |
| 15 | 6         | 3100                | 4.88   | Austin    | 30.2672  |  -97.743 |

### 5.3 Availability
```
( id , listing_id , start_date ,  end_date )
(100 ,     10     , 2023‑06‑01 , 2023‑06‑05 )   -- A for date‑filter test
(101 ,     11     , 2023‑06‑10 , 2023‑06‑15 )   -- B has no overlap with 6/2‑4
```

### 5.4 Bookings
```
( id , listing_id , owner_id , state , start_date , end_date )
(200 ,     10     ,     8    , confirmed , 2023‑07‑10 , 2023‑07‑12 )  -- for overlap rejection
```

### 5.5 Reviews
Not required for tests yet; omit.

Featured‑sitters query will select listings 10,12‑15 (rating ≥ 4.8 & price ≤ 75th %ile = 3000).

## 6. Task Breakdown
- Migrations & seeds; replace fortune demo.  
- Search & booking services plus endpoints.  
- React pages/components and CSS polish.  
- Accessibility audit (axe‑core), keyboard navigation, ARIA labels.  
- Playwright & Jest tests → green.  
- Documentation updates & code review buffer.

## 7. Risks & Mitigations
* Geo search (H6) may need PostGIS later → abstract behind service.  
* City auto‑complete: start with client‑side list, switch to Mapbox Places later.

## 8. Deliverables
* All migrations & seeds committed.  
* Endpoints documented in README.  
* Tests automated in CI.  
* Spec updated with any deviations.
