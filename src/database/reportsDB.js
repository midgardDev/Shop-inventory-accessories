/*import db from './db';

//Profit calculation for a date range
export const calculateProfit = async (startDate, endDate) => {
  try {
    //getting total revenue for sales
    const salesResult = await db.getAllAsync(
      `SELECT SUM(total_amount) as total_revenue,
      SUM(quantity_sold) as total_items_sold
      FROM sales
      WHERE date(date_sold) BETWEEN date(?) AND date(?)`,
      [startDate, endDate]
    );

    //getting cost of goods sold
    const cogsResult = await db.getAllAsync(
      `SELECT SUM(p.buying_price * s.quantity_sold) as total_cogs
      FROM sales s
      JOIN products p ON s.products_id = p.id
      WHERE date(s.date_sold) BETWEEN date(?) AND date(?)`,
      [startDate, endDate]
    );

    //getting total expenses
    const expensesResult = await db.getAllAsync(
      `SELECT SUM(amount) as total_expenses
      FROM expenses
      WHERE date(date) BETWEEN date(?) AND date(?)`,
      [startDate. endDate]
    );

    const totalRevenue = salesResult[0]?.total_rvenue || 0;
    const totalCogs = cogsResult[0]?.total_cogs || 0;
    const totalExpenses = expensesResult[0]?.total_expenses || 0;
    const grossProfit = totalRevenue - totalCogs;
    const netProfit = grossProfit - totalExpenses;

    return {
      success: true,
      profitData: {
        totalRevenue,
        totalCogs,
        grossProfit,
        totalExpenses,
        netProfit,
        totalItemsSold: salesResult[0]?.total_items_sold || 0
      }
    };
  } catch (error) {
    console.log('Error calculating profit:', error);
    return { success: false, error: error.message };
  }
};

//Sales Report
export const getSalesReport = async (period = 'daily') => {
  try {
    let dateFilter = '';
    let groupBy = '';

    switch (period) {
      case 'daily':
        dateFilter = "WHERE date(date_sold) = date('now')";
        groupBy = "GROUP BY strftime('%H', date_sold)";
        break;
      case 'weekly':
        dateFilter = "WHERE date(date_sold) >= date('now', '-7 days')";
        groupBy = "GROUP BY date(date_sold)";
        break;
      case 'monthly':
        dateFilter = "WHERE strftime('%Y-%m', date_sold) = strftime('%Y-%m', 'now')";
        groupBy = "GROUP BY date(date_sold)";
        break;
      case 'yearly':
        dateFilter = "WHERE strftime('%Y', date_sold) = strftime('%Y', 'now')";
        groupBy = "GROUP BY strftime('%Y-%m', date_sold)";
        break;
      default:
        dateFilter = "WHERE date(date_sold) = date('now')";
        groupBy = "GROUP BY strftime('%H', date_sold)";
    }

    const salesData = await db.getAllAsync(
      `SELECT
      COUNT(*) as transaction_count,
      SUM(quantity_sold) as total_items_sold,
      SUM(total_amount) as total_revenue,
      AVG(total_amount) as average_sale,
      date_sold
      FROM sales
      ${dateFilter}
      ${groupBy}
      ORDER BY date_sold DESC`
    );

    return { success: true, period, salesData };
  } catch (error) {
    console.log('Error getting sales report:', error);
    return { success: false, error: error.message };
  }
};

//Inventory Report
export const getInventoryReport = async () => {
  try {
    const inventory = await db.getAllAsync(
      `SELECT 
      p.id,
      p.name,
      c.category_name,
      b.brand_name,
      p.quantity_in_stock,
      p.buying_price,
      p.selling_price,
      (p.quantity_in_stock * p.buying_price) as total_investment,
      (p.selling_price - p.buying_price), as profit_margin
      FROM products p
      LEFT JOIN categories c ON. p.category_id = c.id
      LEFT JOIN  brands b ON p.brand_id = b.id
      ORDER BY p.quantity_in_stock ASC`
    );

    const totalInvestment = inventory.reduce((sum, item) => sum + (item.total_investment || 0), 0);
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity_in_stock, 0);

    return {
      success: true,
      inventory,
      summary: {
        totalProducts: inventory.length,
        totalItems,
        totalInvestment
      }
    };
  } catch (error) {
    console.log('Error getting inventory reports:', error);
    return { success:false, error: error.message };
  }
};

//Profit and loss report
export const getFinancialReport = async (startDate, endDate) => {
  try {
    //getting sales data
    const salesResult = await db.getAllAsync(
      `SELECT
      SUM(total_amount) as total_revenue,
      SUM(quantity_sold) as total_items_sold
      FROM sales
      WHERE date(date_sold) BETWEEN date(?) AND date(?)`,
      [startDate, endDate]
    );

    //Getting Cost of Goods Sold
    const cogsResult = await db.getAllAsync(
      `SELECT SUM(p.buying_price * s.quantity_sold) as total_cogs
      FROM sales s
      JOIN products p ON s.product_id = p.id
      WHERE date(s.date_sold) BETWEEN date(?) AND date(?)`,
      [startDate, endDate]
    );

    //Getting expenses
    const expensesResult = await db.getAllAsync(
      `SELECT SUM(amount) as total_expenses
      FROM expenses
      WJERE date(date) BETWEEN date(?) AND date(?)`,
      [startDate, endDate]
    );
    
    //Getting restock costs
    const restocksResult = await db.getAllAsync(
      `SELECT SUM(quantity_added * cost_price) as total_restock_cost
      FROM restocks
      WHERE date(date_added) BETWEEN date(?) AND date(?)`,
      [startDate, endDate]
    );

    const totalRevenue = salesResult[0]?.total_rvenue || 0;
    const totalCogs = cogsResult[0]?.total_cogs || 0;
    const totalExpenses = expensesResult[0]?.total_expenses || 0;
    const totalRestockCost = restocksResult[0]?.total_restock_cost || 0;

    const grossProfit = totalRevenue - totalCogs;
    const netProfit = grossProfit - totalExpenses;

    return {
      success: true,
      financialData: {
        totalRevenue,
        totalCogs,
        grossProfit,
        totalExpenses,
        totalRestockCost,
        netProfit,
        totalItemsSold: salesResult[0]?.total_items_sold || 0
      }
    };
  } catch (error) {
    console.log('Error getting financial report:', error);
    return { success: error, error: error.message };
  }
};

//Low stock alerts report

export const getLowStockReport = async () => {
  try {
    //getting low stock threshold from settings
    const settings = await db.getAllAsync('SELECT default_low_stock_threshold FROM settings LIMIT 1');
    const threshold = settings[0]?.default_low_stock_threshold || 5;

    const lowStockProducts = await db.getAllAsync(
      `SELECT
      p.id,
      p.name,
      c.category_name,
      b.brand_name,
      p.quantity_in_stock,
      p.selling_price
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.quantity_in_stock <= ? 
      ORDER BY p.quantity_in_stock ASC`,
      [threshold]
    );

    return {
      success: true,
      lowStockProducts,
      threshold
    };
  } catch (error) {
    console.log('Error getting low stock report:', error);
    return { success: false, error: error.message };
  }
};

//Report on Top Selling Products
export const getTopSellingProducts = async (limit = 5) => {
  try {
    const topProducts =await db.getAllAsync(
      `SELECT 
      p.name,
      c.category_name,
      b.brand_name,
      SUM(s.quantity_sold) as total_sold,
      SUM(s.total_amount) as total_revenue
      FROM sales s
      JOIN products p ON s.product_id = p.id
      LEFT JOIN categories c ON p.category_id =c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT ?`,
      [limit]
    );

    return { success: true, topProducts };
  } catch (error) {
    console.log('Error getting top selling products:', error);
    return { success: false, error:error.message };
  }
};*/



import db from './db';

// Calculating Sales Report
export const getSalesReport = async (period = 'daily') => {
  try {
    let dateFilter = '';
    let groupBy = '';
    
    switch (period) {
      case 'daily':
        dateFilter = "WHERE date(date_sold) = date('now')";
        groupBy = "GROUP BY strftime('%H', date_sold)";
        break;
      case 'weekly':
        dateFilter = "WHERE date(date_sold) >= date('now', '-7 days')";
        groupBy = "GROUP BY date(date_sold)";
        break;
      case 'monthly':
        dateFilter = "WHERE strftime('%Y-%m', date_sold) = strftime('%Y-%m', 'now')";
        groupBy = "GROUP BY date(date_sold)";
        break;
      case 'yearly':
        dateFilter = "WHERE strftime('%Y', date_sold) = strftime('%Y', 'now')";
        groupBy = "GROUP BY strftime('%Y-%m', date_sold)";
        break;
      default:
        dateFilter = "WHERE date(date_sold) = date('now')";
        groupBy = "GROUP BY strftime('%H', date_sold)";
    }

    const salesData = await db.getAllAsync(
      `SELECT 
         COUNT(*) as transaction_count,
         SUM(quantity_sold) as total_items_sold,
         SUM(total_amount) as total_revenue,
         AVG(total_amount) as average_sale,
         date_sold
       FROM sales 
       ${dateFilter}
       ${groupBy}
       ORDER BY date_sold DESC`
    );

    return { success: true, period, salesData };
  } catch (error) {
    console.log('Error getting sales report:', error);
    return { success: false, error: error.message };
  }
};

// Getting inventory report
export const getInventoryReport = async () => {
  try {
    const inventory = await db.getAllAsync(
      `SELECT 
         p.id,
         p.name,
         c.category_name,
         b.brand_name,
         p.quantity_in_stock,
         p.buying_price,
         p.selling_price,
         (p.quantity_in_stock * p.buying_price) as total_investment,
         (p.selling_price - p.buying_price) as profit_margin
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       ORDER BY p.quantity_in_stock ASC`
    );

    const totalInvestment = inventory.reduce((sum, item) => sum + (item.total_investment || 0), 0);
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity_in_stock, 0);

    return { 
      success: true, 
      inventory,
      summary: {
        totalProducts: inventory.length,
        totalItems,
        totalInvestment
      }
    };
  } catch (error) {
    console.log('Error getting inventory report:', error);
    return { success: false, error: error.message };
  }
};

// Getting Financial Report (Profit & Loss)
export const getFinancialReport = async (startDate, endDate) => {
  try {
    // Getting sales data
    const salesResult = await db.getAllAsync(
      `SELECT 
         SUM(total_amount) as total_revenue,
         SUM(quantity_sold) as total_items_sold
       FROM sales 
       WHERE date(date_sold) BETWEEN date(?) AND date(?)`,
      [startDate, endDate]
    );

    // Getting const of goods sold
    const cogsResult = await db.getAllAsync(
      `SELECT SUM(p.buying_price * s.quantity_sold) as total_cogs
       FROM sales s
       JOIN products p ON s.product_id = p.id
       WHERE date(s.date_sold) BETWEEN date(?) AND date(?)`,
      [startDate, endDate]
    );

    // Getting expenses
    const expensesResult = await db.getAllAsync(
      `SELECT SUM(amount) as total_expenses
       FROM expenses 
       WHERE date(date) BETWEEN date(?) AND date(?)`,
      [startDate, endDate]
    );

    // Getting restock costs
    const restocksResult = await db.getAllAsync(
      `SELECT SUM(quantity_added * cost_price) as total_restock_cost
       FROM restocks 
       WHERE date(date_added) BETWEEN date(?) AND date(?)`,
      [startDate, endDate]
    );

    const totalRevenue = salesResult[0]?.total_revenue || 0;
    const totalCogs = cogsResult[0]?.total_cogs || 0;
    const totalExpenses = expensesResult[0]?.total_expenses || 0;
    const totalRestockCost = restocksResult[0]?.total_restock_cost || 0;
    
    const grossProfit = totalRevenue - totalCogs;
    const netProfit = grossProfit - totalExpenses;

    return {
      success: true,
      financialData: {
        totalRevenue,
        totalCogs,
        grossProfit,
        totalExpenses,
        totalRestockCost,
        netProfit,
        totalItemsSold: salesResult[0]?.total_items_sold || 0
      }
    };
  } catch (error) {
    console.log('Error getting financial report:', error);
    return { success: false, error: error.message };
  }
};

// Low Stock Alerts Report
export const getLowStockReport = async () => {
  try {
    // Getting low stock threshold from settings
    const settings = await db.getAllAsync('SELECT default_low_stock_threshold FROM settings LIMIT 1');
    const threshold = settings[0]?.default_low_stock_threshold || 5;

    const lowStockProducts = await db.getAllAsync(
      `SELECT 
         p.id,
         p.name,
         c.category_name,
         b.brand_name,
         p.quantity_in_stock,
         p.selling_price
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.quantity_in_stock <= ?
       ORDER BY p.quantity_in_stock ASC`,
      [threshold]
    );

    return { 
      success: true, 
      lowStockProducts,
      threshold 
    };
  } catch (error) {
    console.log('Error getting low stock report:', error);
    return { success: false, error: error.message };
  }
};

// Report on top selling products
export const getTopSellingProducts = async (limit = 5) => {
  try {
    const topProducts = await db.getAllAsync(
      `SELECT 
         p.name,
         c.category_name,
         b.brand_name,
         SUM(s.quantity_sold) as total_sold,
         SUM(s.total_amount) as total_revenue
       FROM sales s
       JOIN products p ON s.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT ?`,
      [limit]
    );

    return { success: true, topProducts };
  } catch (error) {
    console.log('Error getting top selling products:', error);
    return { success: false, error: error.message };
  }
};