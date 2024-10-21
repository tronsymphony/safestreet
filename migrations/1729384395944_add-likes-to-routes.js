/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    // Create a likes table
    pgm.createTable('route_likes', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        route_id: {
            type: 'integer',
            notNull: true,
            references: '"routes"',
            onDelete: 'CASCADE',
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        }
    });

    // Add a new column to routes table to store the number of likes
    pgm.addColumns('routes', {
        like_count: {
            type: 'integer',
            default: 0, // Initialize with 0 likes
            notNull: true,
        }
    });

    // Create an index on route_likes for better performance
    pgm.createIndex('route_likes', ['user_id', 'route_id'], { unique: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    // Remove the likes count column from routes
    pgm.dropColumns('routes', ['like_count']);

    // Drop the route_likes table
    pgm.dropTable('route_likes');
};
