const bcrypt = require('bcryptjs');

exports.up = async (pgm) => {
  // Ensure bcrypt hashes password before inserting into DB
  const hashedPassword = await bcrypt.hash('adminpassword', 10);

  // Check if 'user_role' enum type exists
  pgm.sql(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE "user_role" AS ENUM ('admin', 'subscriber');
      END IF;
    END $$;
  `);

  // Create the 'users' table
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'text', notNull: true, unique: true },
    password: { type: 'text', notNull: true },
    role: { type: 'user_role', notNull: true, default: 'subscriber' }, // Default role is subscriber
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Insert default admin user
  pgm.sql(`
    INSERT INTO users (email, password, role, created_at, updated_at)
    VALUES (
      'admin@example.com',
      '${hashedPassword}', -- Store bcrypt-hashed password
      'admin',
      NOW(),
      NOW()
    )
    ON CONFLICT DO NOTHING;
  `);
};

exports.down = (pgm) => {
  // Drop the 'users' table and 'user_role' enum type
  pgm.dropTable('users');

  // Drop the 'user_role' enum type if it exists
  pgm.sql(`
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        DROP TYPE "user_role";
      END IF;
    END $$;
  `);
};
