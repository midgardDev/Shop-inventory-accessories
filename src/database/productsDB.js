import db from './db';

//adding a new product
export const addProduct = async (productData) => {
    try{
        const { name, category_id, brand_id, buying_price, 
            selling_price, quantity_in_stock, image_uri } = productData;

            const result =await db.runAsync(
                `INSERT INTO products (name, category_id, brand_id, buying_price, 
                selling_price, quantity_in_stock, image_uri, date_added)
                VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                [name, category_id, brand_id, buying_price, selling_price,quantity_in_stock,image_uri || null]
            );

            console.log('Product added successfully with ID:', result.lastInsertRowId);
            return { success: true, product_id: result.lastInsertRowId };
    } catch (error) {
        console.log('Error adding product', error);
        return { success: false, error: error.message };
    }
};

//Getting all products
export const getAllProducts = async () => {
    try {
        const result = await db.getAllAsync(
            `SELECT p.*, c.category_name, b.brand_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            ORDER BY p.date_added DESC`
        );

        return { success: true, products: result };
    } catch (error) {
        console.log('Error getting products:', error);
        return { success: false, error: error.message};
    }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const result = await db.getFirstAsync(
      `SELECT p.*, c.category_name, b.brand_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN brands b ON p.brand_id = b.id 
       WHERE p.id = ?`,
      [productId]
    );
    
    return { success: true, product: result };
  } catch (error) {
    console.log('Error getting product:', error);
    return { success: false, error: error.message };
  }
};

// Update product stock quantity
export const updateProductStock = async (productId, newQuantity) => {
  try {
    await db.runAsync(
      'UPDATE products SET quantity_in_stock = ? WHERE id = ?',
      [newQuantity, productId]
    );
    
    console.log('Product stock updated successfully');
    return { success: true };
  } catch (error) {
    console.log('Error updating product stock:', error);
    return { success: false, error: error.message };
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    await db.runAsync('DELETE FROM products WHERE id = ?', [productId]);
    console.log('Product deleted successfully');
    return { success: true };
  } catch (error) {
    console.log('Error deleting product:', error);
    return { success: false, error: error.message };
  }
};