/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  // pgm.addColumn('comments', {
  //   page_id: {
  //     type: 'integer',
  //     notNull: true,
  //   },
  //   page_type: {
  //     type: 'varchar(50)',
  //     notNull: true,
  //   },
  // });

  // // Optional: Add an index for faster lookups
  // pgm.createIndex('comments', ['page_id', 'page_type']);
};

exports.down = (pgm) => {
  // pgm.dropIndex('comments', ['page_id', 'page_type']);
  // pgm.dropColumn('comments', ['page_id', 'page_type']);
};
