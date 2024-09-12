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
      content: { type: 'text', notNull: true },
      route_id: {
        type: 'integer', 
        notNull: true, 
        references: '"routes"', // Add foreign key to routes table
        onDelete: 'CASCADE' // If a route is deleted, its associated posts are also deleted
      },
      created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
      updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    });
    pgm.createIndex('posts', 'route_id');
  };

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('posts');
  };
