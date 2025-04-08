/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  // Create the 'comments' table with all required columns
  pgm.createTable('comments', {
    id: { type: "text", primaryKey: true },
    page_id: { type: 'uuid', notNull: true }, // ✅ Ensure this matches posts.id or blog_posts.id
    page_type: { type: 'varchar(50)', notNull: true }, // Type: 'post' or 'blog_post'
    author_id: {
      type: 'uuid', // ✅ Match users.id type
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE', // If a user is deleted, their comments are also deleted
    },
    author: { type: 'varchar(255)', notNull: true },
    content: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Add an index for faster lookups on page_id and page_type
  pgm.createIndex('comments', ['page_id', 'page_type']);
};

/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  // Drop the index and the table during rollback
  pgm.dropIndex('comments', ['page_id', 'page_type']);
  pgm.dropTable('comments');
};
