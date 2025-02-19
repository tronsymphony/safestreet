exports.up = (pgm) => {
  pgm.createTable("routes", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    name: { type: "text", notNull: true },
    description: { type: "text" },
    user_id: { type: "uuid", notNull: true, references: "users(id)", onDelete: "CASCADE" }, 
    coordinates: { type: "jsonb", notNull: true }, // ✅ New column for route data
    created_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
  });

  pgm.createIndex("routes", "user_id");
};

exports.down = (pgm) => {
  pgm.dropTable("routes");
};
