/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('routes', {
      id: 'id',
      route: { type: 'jsonb', notNull: true },
      created_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true },
      like_count: { type: 'integer', default: 0, notNull: true },
  });
};

/**
* @param pgm {import('node-pg-migrate').MigrationBuilder}
* @returns {Promise<void> | void}
*/
exports.down = (pgm) => {
  pgm.dropTable('routes');
};