/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('blog_posts', {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
      title: { type: 'text', notNull: true },
      slug: { type: 'text', notNull: true, unique: true },
      content: { type: 'text', notNull: true },
      featured_image: { type: 'text',notNull:false }, // URL or path to the featured image
      likes: { type: 'integer', notNull: false, default: 0 }, // Default likes to 0
      author: { type: 'text', notNull: true }, // New author field
      user_id: { type: "uuid", notNull: true, references: "users(id)", onDelete: "CASCADE" }, 
      created_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true },
      updated_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true },
  });

  pgm.createIndex('blog_posts', 'slug');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('blog_posts');
};
