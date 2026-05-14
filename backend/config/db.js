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
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
      }
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

    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS checklist_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50),
        shift_id VARCHAR(50),
        question_id INT,
        question_text VARCHAR(255),
        status VARCHAR(20),
        remarks TEXT,
        image_ref VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS occurrences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50),
        shift_id VARCHAR(50),
        spot_id VARCHAR(100),
        time_logged VARCHAR(50),
        gps_lat DECIMAL(10, 8),
        gps_lng DECIMAL(11, 8),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS occurrence_evidence (
        id INT AUTO_INCREMENT PRIMARY KEY,
        occurrence_id INT,
        image_ref VARCHAR(255),
        FOREIGN KEY (occurrence_id) REFERENCES occurrences(id) ON DELETE CASCADE
      );
    `);

    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS patrol_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50),
        site VARCHAR(100),
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP NULL,
        incidents_reported INT DEFAULT 0,
        checkpoints_completed INT DEFAULT 0,
        total_checkpoints INT DEFAULT 0
      );
    `);
    
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        role VARCHAR(50) DEFAULT 'Supervisor',
        site VARCHAR(100),
        shift VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed test employee for POC (RJ123 → Firebase test number)
    await dbPool.execute(`
      INSERT IGNORE INTO employees (employee_id, name, phone_number, role, site, shift)
      VALUES ('RJ123', 'Rohan Joshi', '+919999999999', 'Supervisor', 'Tech Park', '08:00 AM - 04:00 PM');
    `);
    
    console.log('MySQL Schema initialized');
  } catch (error) {
    console.error('Error initializing schema:', error);
  }
};

module.exports = { connectMySQL, initSchema, getPool: () => pool };
