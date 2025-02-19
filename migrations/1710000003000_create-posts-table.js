exports.up = (pgm) => {
  pgm.createTable("posts", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") }, // ✅ Use UUID for post ID
    title: { type: "text", notNull: true },
    slug: { type: "text", notNull: true, unique: true },
    content: { type: "text", notNull: true },
    featured_image: { type: "text" },
    route_id: { type: "uuid", references: "routes(id)", onDelete: "SET NULL" }, // ✅ Match routes.id type (UUID)
    user_id: { type: "uuid", notNull: true, references: "users(id)", onDelete: "CASCADE" }, // ✅ Match users.id type (UUID)
    route_condition: { type: "text", notNull: false },
    route_city: { type: "text", notNull: false },
    created_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
  });

  pgm.createIndex("posts", "slug");
  pgm.createIndex("posts", "route_id");
  pgm.createIndex("posts", "user_id");
};

exports.down = (pgm) => {
  pgm.dropTable("posts"); // ✅ Drops entire table on rollback
};
