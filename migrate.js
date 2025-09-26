const { initializeDatabase } = require('./config/database');

console.log('🚀 Starting database migration...');

const runMigration = async () => {
    try {
        await initializeDatabase();
        console.log('🎉 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    }
};

runMigration();
