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
    pgm.createTable('likes', {
        id: 'id',
        user_id: { type: 'integer', notNull: true },
        route_id: { type: 'integer', notNull: true, references: '"routes"', onDelete: 'CASCADE' },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true },
      });
    
      // Ensure a user can only like a route once
      pgm.addConstraint('likes', 'unique_user_route', {
        unique: ['user_id', 'route_id'],
      });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('likes');
};
