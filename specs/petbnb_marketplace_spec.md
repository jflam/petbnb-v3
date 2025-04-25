# PetBnB Product Specification

## Overview
PetBnB is an Airbnb‑style two‑sided marketplace that connects pet owners with background‑checked, insured, and reviewed pet sitters. The web application supports search & discovery, booking & payment, real‑time messaging, and review flows. The primary interaction is the search results page sketched below, featuring a filter sidebar and a responsive card grid of sitter listings.

```
+------------------------------------------------------------------------------+
|                                                                              |
|                               [   search   ]                                 |
|                                                                              |
|                                                                      (O)     |
|                                                                              |
|  +-----------+   +---------+   +---------+                                   |
|  |  FILTERS  |   |         |   |         |                                   |
|  |           |   | listings|   |         |                                   |
|  |           |   |         |   |         |                                   |
|  |           |   +---------+   +---------+                                   |
|  |           |                                                         	   |
|  |           |   +---------+   +---------+                                   |
|  |           |   |         |   |         |                                   |
|  |           |   |         |   |         |                                   |
|  |           |   |         |   |         |                                   |
|  +-----------+   +---------+   +---------+                                   |
+------------------------------------------------------------------------------+
```

## Domain Concepts
- User  
  - Owner  
  - Sitter (must be verified)  
- Listing (advertises sitter’s services, rates, and availability)  
- Booking (state machine: requested → confirmed → completed → cancelled)  
- Review (owner → sitter, sitter → owner)  
- Availability (calendar slots)  
- MessageThread  
- Payment (escrow until stay completed)  

## Invariants
1. Every Listing is linked to exactly one verified Sitter.  
2. A Sitter may have many Listings, but a Booking can reference only one Listing.  
3. Availability slots cannot overlap for the same Listing.  
4. A Booking cannot be confirmed if any date in the range violates Invariant 3.  
5. Payments settle only when Booking state = completed.  
6. Reviews are immutable once submitted.

## Competitive Landscape
### Rover
‑ Large U.S. market share, focuses on dog walking & boarding. Strength: supply liquidity. Weakness: weak insurance outside U.S.  
### Wag!
‑ Emphasises on‑demand walks. Strength: fast ETAs. Weakness: quality control issues.  
### TrustedHousesitters
‑ Subscription model for house‑ & pet‑sitting. Strength: global footprint. Weakness: high upfront cost to owners.

## Features

### 1. Homepage
#### Motivation
Most first‑time visitors are dog owners seeking an immediate match.  
A clear, opinionated landing screen increases conversion into the search flow.

#### User Stories
1. As a First‑time Visitor I see a hero section that prompts “Find a trusted dog sitter”.  
2. As an Owner with a dog I can enter my city and dates and jump directly to pre‑filtered search results.  
3. As a Returning User I see personalized dog sitter recommendations based on past bookings.

#### Requirements
H1. Hero search fields: city/ZIP (auto‑complete), start date, end date.  
H2. Pet type defaults to “Dog” and is non‑editable on the homepage.  
H3. Top 6 “Featured Dog Sitters” (rating ≥ 4.8, price ≤ 75th percentile) are displayed as cards.  
H4. Primary CTA “Search Dog Sitters” submits to `/search?petType=dog&…`.  
H5. If the visitor is authenticated, replace hero with “Welcome back, {firstName}” and show personalized dog sitter carousel.  
H6. Full‑text search on city/ZIP with geo‑radius ≤ 50 km.  
H7. Date‑range filter must intersect sitter availability.  
H8. Additional filters: price range, rating ≥ X.  
H9. Sort modes: relevance (default), price ascending, rating descending.  
H10. Paginate 20 listings per page.
#### Acceptance Criteria (Gherkin)
```
Scenario: Anonymous visitor sees default dog sitter hero
  Given an unauthenticated visitor
  When they land on "/"
  Then the hero headline reads "Find a trusted dog sitter"
  And the pet type selector is hidden or pre‑selected to Dog

Scenario: Hero search redirects with dog filter applied
  Given the visitor fills city = "Austin, TX"
  And selects 2023‑08‑01 to 2023‑08‑05
  When they click "Search Dog Sitters"
  Then the browser navigates to "/search?petType=dog&city=Austin%2C%20TX&start=2023‑08‑01&end=2023‑08‑05"

Scenario: Authenticated visitor sees personalized recommendations
  Given user Jane has completed 2 bookings with sitter IDs [42, 87]
  And Jane is logged in
  When she lands on "/"
  Then a carousel titled "Sitters you'll love" is shown
  And the first 6 cards include sitters 42 and 87

Scenario: Filter by dates hides unavailable sitters      # moved from Search & Discovery
  Given a sitter listing with availability on 2023‑06‑01 to 2023‑06‑05
  And another sitter listing with no availability in that range
  When the owner searches with dates 2023‑06‑02 to 2023‑06‑04
  Then only the first sitter appears in results

Scenario: Price sort ascending                            # moved from Search & Discovery
  Given two sitter listings priced $30 and $20 per night
  When the owner sorts results by price ascending
  Then the $20 listing appears before the $30 listing

Scenario: Overlapping booking rejected
  Given a confirmed booking for sitter A from 2023‑07‑10 to 2023‑07‑12
  When another owner attempts to book the same sitter for 2023‑07‑11 to 2023‑07‑13
  Then the system rejects the booking with message "Dates unavailable"
```
#### Testing (Playwright)
homepage.spec.ts – covers hero, redirect, and personalized scenarios  
search_filters.spec.ts – covers date filter & price sort scenarios

### 2. Booking & Payments
#### Motivation
Trustworthy, seamless transactions increase conversion.

#### User Stories
1. As an Owner I can request a booking and pay securely.  
2. As a Sitter I can accept or decline requests.  
3. As the Platform I hold funds in escrow until the stay completes.

#### Requirements
B1. Integrate Stripe for PCI‑compliant payments.  
B2. Email + in‑app notifications on state transitions.  
B3. Automatic payout T+1 after completion.

### 3. Reviews & Ratings
...existing content for features yet to be detailed...
