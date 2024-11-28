/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('locations', {
    id: 'id',
    title: { type: 'text', notNull: true }, // title of the location
    slug: { type: 'text', notNull: true, unique: true }, // Unique slug for the location
    description: { type: 'text' }, // Description of the location
    coordinates: { type: 'jsonb', notNull: true },
    city: { type: 'text' }, // City where the location is situated
    featured_image: { type: 'text' }, // Optional featured image
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.createIndex('locations', ['coordinates']); // Index for fast geo-queries
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('locations');
};