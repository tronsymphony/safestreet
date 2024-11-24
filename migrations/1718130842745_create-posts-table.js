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
  pgm.createTable('posts', {
    id: 'id',
    title: { type: 'text', notNull: true },
    slug: { type: 'text', notNull: true },
    content: { type: 'text', notNull: true },
    featured_image: { type: 'text' }, // New field for the featured image
    route_condition: { type: 'text' }, // New field for the route condition
    route_city: { type: 'text' }, // New field for the route city
    route_id: {
      type: 'integer',
      notNull: true,
      references: '"routes"',
      onDelete: 'CASCADE',
    },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.createIndex('posts', 'route_id');
};

exports.down = (pgm) => {
  pgm.dropTable('posts');
};
