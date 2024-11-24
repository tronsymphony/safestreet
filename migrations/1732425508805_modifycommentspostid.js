/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    // pgm.alterColumn('comments', 'post_id', {
    //   notNull: false, // Allow NULL values for post_id
    // });
  };
  
  exports.down = (pgm) => {
    // pgm.alterColumn('comments', 'post_id', {
    //   notNull: true, // Revert to requiring post_id
    // });
  };
  
