/**
 * @param { import("knex").Knex } knex
 */
exports.up = (knex) => {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('first_name').notNullable();
      table.string('email').notNullable().unique();
      table.enu('role', ['owner', 'sitter']).notNullable();
      table.boolean('verified').defaultTo(false);
    })
    .createTable('listings', (table) => {
      table.increments('id').primary();
      table.integer('sitter_id').unsigned().notNullable();
      table.foreign('sitter_id').references('users.id');
      table.string('title').notNullable();
      table.integer('nightly_price_cents').notNullable();
      table.float('rating');
      table.enu('pet_type', ['dog', 'cat', 'other']).notNullable();
      table.string('city').notNullable();
      table.float('lat');
      table.float('lng');
      table.string('hero_image_url');
    })
    .createTable('availability', (table) => {
      table.increments('id').primary();
      table.integer('listing_id').unsigned().notNullable();
      table.foreign('listing_id').references('listings.id');
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
    })
    .createTable('bookings', (table) => {
      table.increments('id').primary();
      table.integer('listing_id').unsigned().notNullable();
      table.foreign('listing_id').references('listings.id');
      table.integer('owner_id').unsigned().notNullable();
      table.foreign('owner_id').references('users.id');
      table.enu('state', ['requested', 'confirmed', 'completed', 'cancelled']).notNullable();
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
    })
    .createTable('reviews', (table) => {
      table.increments('id').primary();
      table.integer('booking_id').unsigned().notNullable();
      table.foreign('booking_id').references('bookings.id');
      table.integer('author_id').unsigned().notNullable();
      table.foreign('author_id').references('users.id');
      table.float('rating').notNullable();
      table.text('comment');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = (knex) => {
  return knex.schema
    .dropTableIfExists('reviews')
    .dropTableIfExists('bookings')
    .dropTableIfExists('availability')
    .dropTableIfExists('listings')
    .dropTableIfExists('users');
};