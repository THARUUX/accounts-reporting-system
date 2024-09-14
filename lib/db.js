
import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE,
    waitForConnections: true,
    connectionLimit: 5, // Adjust based on your needs
    queueLimit: 0
});

export default db;