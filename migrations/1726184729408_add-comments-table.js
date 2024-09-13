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
    pgm.createTable('comments', {
        id: 'id',
        post_id: {
          type: 'integer',
          notNull: true,
          references: '"posts"', // Foreign key to posts table
          onDelete: 'CASCADE' // If a post is deleted, its comments are also deleted
        },
        author_id: {
          type: 'integer',
          notNull: true,
          references: '"users"',
          onDelete: 'CASCADE', // If a user is deleted, their comments are also deleted
        },
        author: { type: 'varchar(255)', notNull: true },
        content: { type: 'text', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
      });
    
      pgm.createIndex('comments', 'post_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('comments');
};
