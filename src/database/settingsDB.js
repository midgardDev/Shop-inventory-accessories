import db from './db';

// Initializing default settings
export const initializeSettings = async () => {
  try {
    // Checking if settings already exist
    const existingSettings = await db.getAllAsync('SELECT * FROM settings LIMIT 1');
    
    if (existingSettings.length === 0) {
      // Insertting default settings
      const result = await db.runAsync(
        `INSERT INTO settings (
          shop_name, currency, default_low_stock_threshold, theme, owner_name, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        ['Paul Accessories', 'KSH', 5, 'light', 'Paul Muiruri']
      );
      console.log('Default settings initialized with ID:', result.lastInsertRowId);
    }
    
    return { success: true };
  } catch (error) {
    console.log('Error initializing settings:', error);
    return { success: false, error: error.message };
  }
};

// Getting current settings
export const getSettings = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM settings LIMIT 1');
    
    if (result.length > 0) {
      return { success: true, settings: result[0] };
    } else {
      // Initializing settings if they does not exist
      await initializeSettings();
      const newResult = await db.getAllAsync('SELECT * FROM settings LIMIT 1');
      return { success: true, settings: newResult[0] };
    }
  } catch (error) {
    console.log('Error getting settings:', error);
    return { success: false, error: error.message };
  }
};

// Updatting settings
export const updateSettings = async (settingsData) => {
  try {
    const {
      shop_name,
      currency,
      default_low_stock_threshold,
      theme,
      owner_name
    } = settingsData;

    const result = await db.runAsync(
      `UPDATE settings SET 
        shop_name = ?, 
        currency = ?, 
        default_low_stock_threshold = ?, 
        theme = ?, 
        owner_name = ?, 
        updated_at = datetime('now')
      WHERE id = 1`,
      [shop_name, currency, default_low_stock_threshold, theme, owner_name]
    );

    console.log('Settings updated successfully');
    return { success: true, changes: result.changes };
  } catch (error) {
    console.log('Error updating settings:', error);
    return { success: false, error: error.message };
  }
};

// Getting low stock threshold from settings
export const getLowStockThreshold = async () => {
  try {
    const settings = await getSettings();
    if (settings.success) {
      return { success: true, threshold: settings.settings.default_low_stock_threshold };
    }
    return { success: false, error: 'Could not retrieve settings' };
  } catch (error) {
    console.log('Error getting low stock threshold:', error);
    return { success: false, error: error.message };
  }
};