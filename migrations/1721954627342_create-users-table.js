/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 * @type {import('node-pg-migrate').MigrationBuilderActions}
 */
exports.up = (pgm) => {
    pgm.createType('user_role', ['admin', 'subscriber']);

    pgm.createTable('users', {
      id: 'id',
      email: { type: 'text', notNull: true, unique: true },
      password: { type: 'text', notNull: true },
      role: { type: 'user_role', notNull: true, default: 'subscriber' }, // Default role is subscriber
      created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
      updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    });
    
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('users');
    pgm.dropType('user_role');
  };
  