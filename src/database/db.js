import * as SQLite from 'expo-sqlite';

// Opening database
const db = SQLite.openDatabaseSync('shop.db');

export const initDatabase = async () => {
  try {
    console.log('Starting database initialization...');
    
    // Creating tables
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT UNIQUE
      );`
    );
    console.log('Categories table created successfully');
    
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_name TEXT UNIQUE
      );`
    );
    console.log('Brands table created successfully');
    
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category_id INTEGER,
        brand_id INTEGER,
        buying_price REAL,
        selling_price REAL,
        quantity_in_stock INTEGER,
        image_uri TEXT,
        date_added TEXT,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
      );`
    );
    console.log('Products table created successfully');
    
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        quantity_sold INTEGER,
        selling_price_at_time REAL,
        total_amount REAL,
        date_sold TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );`
    );
    console.log('Sales table created successfully');

    await db.runAsync(
        `CREATE TABLE IF NOT EXISTS restocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        quantity_added INTEGER,
        cost_price REAL,
        date_added TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );`
    );
    console.log('Restocks table created successfully');

    await db.runAsync(
        `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reason TEXT,
        amount REAL,
        date TEXT
        );`
    );
    console.log('Expenses table created successfully');

    await db.runAsync(
        `CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shop_name TEXT,
        currency TEXT,
        default_low_stock_threshold INTEGER,
        theme TEXT,
        owner_name TEXT,
        created_at TEXT,
        updated_at TEXT
        );`
    );
    console.log('Settings table created successfully');
    
    console.log('All tables created successfully!');
    return true;
    
  } catch (error) {
    console.log('Error creating tables:', error);
    return false;
  }
};

export default db;