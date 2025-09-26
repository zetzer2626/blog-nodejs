const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
// Use internal URL for Railway deployment, external URL for local development
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID;
const defaultConnectionString = isRailway 
    ? 'postgresql://postgres:jqQXHWMzHafjsgHtBvqYPlUNKlCottcQ@postgres.railway.internal:5432/railway'
    : 'postgresql://postgres:jqQXHWMzHafjsgHtBvqYPlUNKlCottcQ@containers-us-west-146.railway.app:5432/railway';

const dbConfig = {
    connectionString: process.env.DATABASE_URL || defaultConnectionString,
    ssl: process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
};

// Log database configuration (without sensitive data)
console.log('🔧 Database configuration:');
console.log(`   - Host: ${dbConfig.connectionString.split('@')[1]?.split(':')[0] || 'localhost'}`);
console.log(`   - Port: ${dbConfig.connectionString.split(':')[3]?.split('/')[0] || '5432'}`);
console.log(`   - Database: ${dbConfig.connectionString.split('/')[3] || 'unknown'}`);
console.log(`   - SSL: ${dbConfig.ssl ? 'enabled' : 'disabled'}`);

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
});

// Initialize database tables
const initializeDatabase = async () => {
    let retries = 3;
    let delay = 2000;

    while (retries > 0) {
        try {
            console.log(`🔄 Attempting to connect to database... (${4 - retries}/3)`);
            
            // Test connection first
            await pool.query('SELECT NOW()');
            console.log('✅ Database connection successful');

            // Create posts table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS posts (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    author VARCHAR(100) DEFAULT 'Anonymous',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Posts table created/verified');

            // Create index for better performance
            await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)
            `);
            console.log('✅ Index created/verified');

            // Insert sample data if table is empty
            const result = await pool.query('SELECT COUNT(*) FROM posts');
            const count = parseInt(result.rows[0].count);

            if (count === 0) {
                console.log('📝 Inserting sample blog posts...');
                
                const samplePosts = [
                    {
                        title: 'Welcome to My Blog',
                        content: 'This is my first blog post! I\'m excited to share my thoughts and experiences with you. Stay tuned for more interesting content.',
                        author: 'Admin'
                    },
                    {
                        title: 'Getting Started with Node.js',
                        content: 'Node.js is a powerful JavaScript runtime that allows you to build scalable network applications. In this post, I\'ll share some tips for beginners.',
                        author: 'Admin'
                    },
                    {
                        title: 'Bootstrap for Beautiful UIs',
                        content: 'Bootstrap is a popular CSS framework that makes it easy to create responsive and beautiful user interfaces. Let\'s explore its features together.',
                        author: 'Admin'
                    },
                    {
                        title: 'PostgreSQL Integration',
                        content: 'Now our blog is powered by PostgreSQL! This provides better data persistence, scalability, and reliability compared to in-memory storage.',
                        author: 'Admin'
                    }
                ];

                for (const post of samplePosts) {
                    await pool.query(
                        'INSERT INTO posts (title, content, author) VALUES ($1, $2, $3)',
                        [post.title, post.content, post.author]
                    );
                }
                
                console.log('✅ Sample posts inserted successfully');
            } else {
                console.log(`✅ Database already has ${count} posts`);
            }

            console.log('✅ Database initialized successfully');
            return; // Success, exit the retry loop
            
        } catch (error) {
            retries--;
            console.error(`❌ Error initializing database (${4 - retries}/3):`, error.message);
            
            if (retries > 0) {
                console.log(`⏳ Retrying in ${delay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                console.error('❌ Failed to initialize database after 3 attempts');
                throw error;
            }
        }
    }
};

module.exports = {
    pool,
    initializeDatabase
};
