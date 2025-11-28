import db from './db';

// Adding a new expense
export const addExpense = async (expenseData) => {
  try {
    const { reason, amount } = expenseData;
    
    const result = await db.runAsync(
      `INSERT INTO expenses (reason, amount, date) 
       VALUES (?, ?, datetime('now'))`,
      [reason, amount]
    );
    
    console.log('Expense added successfully with ID:', result.lastInsertRowId);
    return { success: true, expenseId: result.lastInsertRowId };
  } catch (error) {
    console.log('Error adding expense:', error);
    return { success: false, error: error.message };
  }
};

// Getting all expnses
export const getAllExpenses = async () => {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM expenses ORDER BY date DESC'
    );
    
    return { success: true, expenses: result };
  } catch (error) {
    console.log('Error getting expenses:', error);
    return { success: false, error: error.message };
  }
};

// Getting expenses by date range
export const getExpensesByDateRange = async (startDate, endDate) => {
  try {
    const result = await db.getAllAsync(
      `SELECT * FROM expenses 
       WHERE date BETWEEN ? AND ? 
       ORDER BY date DESC`,
      [startDate, endDate]
    );

    const totalExpenses = result.reduce((sum, expense) => sum + expense.amount, 0);

    return { 
      success: true, 
      expenses: result,
      totalExpenses 
    };
  } catch (error) {
    console.log('Error getting expenses by date range:', error);
    return { success: false, error: error.message };
  }
};

// Deleting an expense
export const deleteExpense = async (expenseId) => {
  try {
    await db.runAsync('DELETE FROM expenses WHERE id = ?', [expenseId]);
    console.log('Expense deleted successfully');
    return { success: true };
  } catch (error) {
    console.log('Error deleting expense:', error);
    return { success: false, error: error.message };
  }
};