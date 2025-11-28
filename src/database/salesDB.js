import db from './db';
import { updateProductStock } from './productsDB';

// Record a new sale
export const recordSale = async (saleData) => {
  try {
    const { product_id, quantity_sold, selling_price_at_time } = saleData;
    const total_amount = quantity_sold * selling_price_at_time;

    // Start a transaction to ensure both operations succeed or fail together
    await db.withTransactionAsync(async () => {
      // 1. Record the sale
      const saleResult = await db.runAsync(
        `INSERT INTO sales (product_id, quantity_sold, selling_price_at_time, total_amount, date_sold) 
         VALUES (?, ?, ?, ?, datetime('now'))`,
        [product_id, quantity_sold, selling_price_at_time, total_amount]
      );

      // 2. Update product stock
      const product = await db.getFirstAsync(
        'SELECT quantity_in_stock FROM products WHERE id = ?',
        [product_id]
      );

      if (product) {
        const newQuantity = product.quantity_in_stock - quantity_sold;
        await updateProductStock(product_id, newQuantity);
      }

      console.log('Sale recorded successfully with ID:', saleResult.lastInsertRowId);
    });

    return { success: true, message: 'Sale recorded successfully' };
  } catch (error) {
    console.log('Error recording sale:', error);
    return { success: false, error: error.message };
  }
};

// Get all sales with product details
export const getAllSales = async () => {
  try {
    const result = await db.getAllAsync(
      `SELECT s.*, p.name as product_name, c.category_name, b.brand_name 
       FROM sales s 
       JOIN products p ON s.product_id = p.id 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN brands b ON p.brand_id = b.id 
       ORDER BY s.date_sold DESC`
    );

    return { success: true, sales: result };
  } catch (error) {
    console.log('Error getting sales:', error);
    return { success: false, error: error.message };
  }
};

// Get sales report by date range
export const getSalesReport = async (startDate, endDate) => {
  try {
    const result = await db.getAllAsync(
      `SELECT 
         s.date_sold,
         p.name as product_name,
         s.quantity_sold,
         s.selling_price_at_time,
         s.total_amount,
         c.category_name,
         b.brand_name
       FROM sales s 
       JOIN products p ON s.product_id = p.id 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN brands b ON p.brand_id = b.id 
       WHERE s.date_sold BETWEEN ? AND ?
       ORDER BY s.date_sold DESC`,
      [startDate, endDate]
    );

    // Calculate totals
    const totalRevenue = result.reduce((sum, sale) => sum + sale.total_amount, 0);
    const totalItemsSold = result.reduce((sum, sale) => sum + sale.quantity_sold, 0);

    return { 
      success: true, 
      sales: result,
      summary: {
        totalRevenue,
        totalItemsSold,
        totalTransactions: result.length
      }
    };
  } catch (error) {
    console.log('Error getting sales report:', error);
    return { success: false, error: error.message };
  }
};

// Get daily sales total
export const getDailySales = async (date = null) => {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const result = await db.getAllAsync(
      `SELECT 
         SUM(total_amount) as daily_total,
         COUNT(*) as transaction_count,
         SUM(quantity_sold) as items_sold
       FROM sales 
       WHERE date(date_sold) = date(?)`,
      [targetDate]
    );

    return { 
      success: true, 
      dailySales: result[0] || { daily_total: 0, transaction_count: 0, items_sold: 0 }
    };
  } catch (error) {
    console.log('Error getting daily sales:', error);
    return { success: false, error: error.message };
  }
};