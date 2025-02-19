const bcrypt = require("bcryptjs");

exports.up = async (pgm) => {
  // Ensure bcrypt hashes password before inserting into DB
  const hashedPassword = await bcrypt.hash("adminpassword", 10);

  // Create 'user_role' ENUM if it does not exist
  pgm.sql(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE "user_role" AS ENUM ('admin', 'subscriber');
      END IF;
    END $$;
  `);

  // Create 'users' table
  pgm.createTable("users", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    email: { type: "text", notNull: true, unique: true },
    password: { type: "text", notNull: true },
    role: { type: "user_role", notNull: true, default: "subscriber" },
    created_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
  });

  // Insert default admin user
  pgm.sql(`
    INSERT INTO users (email, password, role, created_at, updated_at)
    VALUES (
      'admin@example.com',
      '${hashedPassword}',
      'admin',
      NOW(),
      NOW()
    )
    ON CONFLICT DO NOTHING;
  `);
};

exports.down = (pgm) => {
  pgm.dropTable("users");
  pgm.sql(`DROP TYPE IF EXISTS "user_role";`);
};
