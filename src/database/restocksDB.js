import db from './db';
import { updateProductStock } from './productsDB';

// Recording a new restock
export const recordRestock = async (restockData) => {
  try {
    const { product_id, quantity_added, cost_price } = restockData;

    await db.withTransactionAsync(async () => {
      // Recording restock
      const restockResult = await db.runAsync(
        `INSERT INTO restocks (product_id, quantity_added, cost_price, date_added) 
         VALUES (?, ?, ?, datetime('now'))`,
        [product_id, quantity_added, cost_price]
      );

      // Updating product stock
      const product = await db.getFirstAsync(
        'SELECT quantity_in_stock FROM products WHERE id = ?',
        [product_id]
      );

      if (product) {
        const newQuantity = product.quantity_in_stock + quantity_added;
        await updateProductStock(product_id, newQuantity);
      }

      console.log('Restock recorded successfully with ID:', restockResult.lastInsertRowId);
    });

    return { success: true, message: 'Restock recorded successfully' };
  } catch (error) {
    console.log('Error recording restock:', error);
    return { success: false, error: error.message };
  }
};

// Getting all restocks with product details
export const getAllRestocks = async () => {
  try {
    const result = await db.getAllAsync(
      `SELECT r.*, p.name as product_name, c.category_name, b.brand_name 
       FROM restocks r 
       JOIN products p ON r.product_id = p.id 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN brands b ON p.brand_id = b.id 
       ORDER BY r.date_added DESC`
    );

    return { success: true, restocks: result };
  } catch (error) {
    console.log('Error getting restocks:', error);
    return { success: false, error: error.message };
  }
};

// Get low stock products (below threshold)
export const getLowStockProducts = async (threshold = 10) => {
  try {
    const result = await db.getAllAsync(
      `SELECT p.*, c.category_name, b.brand_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN brands b ON p.brand_id = b.id 
       WHERE p.quantity_in_stock <= ? 
       ORDER BY p.quantity_in_stock ASC`,
      [threshold]
    );

    return { success: true, lowStockProducts: result };
  } catch (error) {
    console.log('Error getting low stock products:', error);
    return { success: false, error: error.message };
  }
};

// Get restock history for a specific product
export const getProductRestockHistory = async (productId) => {
  try {
    const result = await db.getAllAsync(
      `SELECT r.*, p.name as product_name 
       FROM restocks r 
       JOIN products p ON r.product_id = p.id 
       WHERE r.product_id = ? 
       ORDER BY r.date_added DESC`,
      [productId]
    );

    return { success: true, restockHistory: result };
  } catch (error) {
    console.log('Error getting product restock history:', error);
    return { success: false, error: error.message };
  }
};