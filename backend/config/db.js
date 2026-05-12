const mysql = require('mysql2/promise');

let pool;

const connectMySQL = async () => {
  try {
    if (!process.env.MYSQL_URL) {
      console.warn('MYSQL_URL not found. Using local mock MySQL pool.');
      return {
        query: async () => [[]],
        execute: async () => [[]]
      };
    }
    
    pool = mysql.createPool({
      uri: process.env.MYSQL_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    const connection = await pool.getConnection();
    console.log('Connected to MySQL (TiDB) successfully');
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('Failed to connect to MySQL:', error);
    process.exit(1);
  }
};

const initSchema = async (dbPool) => {
  if (!process.env.MYSQL_URL) return; 
  
  try {
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'Guard',
        phone VARCHAR(20)
      );
    `);
    
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS sites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(255)
      );
    `);
    
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS checkpoints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        site_id INT,
        name VARCHAR(100) NOT NULL,
        qr_code VARCHAR(100),
        FOREIGN KEY (site_id) REFERENCES sites(id)
      );
    `);

    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS patrol_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50),
        shift_id VARCHAR(50),
        checkpoint_name VARCHAR(100),
        status VARCHAR(20),
        remarks TEXT,
        image_ref VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('MySQL Schema initialized');
  } catch (error) {
    console.error('Error initializing schema:', error);
  }
};

module.exports = { connectMySQL, initSchema, getPool: () => pool };
