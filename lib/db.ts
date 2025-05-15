import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'taxidb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database');
        connection.release();
    } catch (error) {
        console.error('Error connecting to MySQL database:', error);
    }
}

// Export the pool and test function
export { pool, testConnection }; 