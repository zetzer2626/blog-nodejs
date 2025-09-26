// Environment configuration
require('dotenv').config();

const config = {
    // Database configuration
    database: {
        url: process.env.DATABASE_URL || 'postgresql://postgres:jqQXHWMzHafjsgHtBvqYPlUNKlCottcQ@containers-us-west-146.railway.app:5432/railway',
        host: process.env.DB_HOST || 'containers-us-west-146.railway.app',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'railway',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'jqQXHWMzHafjsgHtBvqYPlUNKlCottcQ',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    },
    
    // Application configuration
    app: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
        name: 'Blog Application'
    }
};

module.exports = config;
