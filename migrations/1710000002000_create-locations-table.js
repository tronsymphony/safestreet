exports.up = (pgm) => {
  pgm.createTable("locations", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    title: { type: "text", notNull: true },
    slug: { type: "text", notNull: true, unique: true },
    description: { type: "text" },
    coordinates: { type: "jsonb", notNull: true },
    city: { type: "text" },
    featured_image: { type: "text" },
    user_id: { type: "uuid", notNull: true, references: "users(id)", onDelete: "CASCADE" }, 
    created_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
  });

  pgm.createIndex("locations", ["coordinates"]);
  pgm.createIndex("locations", "user_id");
};

exports.down = (pgm) => {
  pgm.dropTable("locations");
};
