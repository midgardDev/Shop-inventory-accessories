import db from './db';

export const addCategory = async(CategoryName) => {
    try {
        const result = await db.runAsync(
            `INSERT INTO categories (category_name) VALUES (?)`,
            [CategoryName]
        );

        console.log('Categories added successfully with ID:', result.lastInsertRowId);
        return { success: true, categoryId: result.lastInsertRowId };
    } catch (error) {
        console.log('Error adding category:', error);
        return { success: false, error: error.message };
    }
};

//Getting all categories

export const getAllCategories = async () => {
    try {
        const result = await db.getAllAsync(
            `SELECT * FROM categories ORDER BY category_name`
        );
        return { success: true, categories: result };
    } catch (error){
        console.log('Error getting categories:', error);
        return { success: false, error: error.message };
    }
};

//Deleting Category

export const deleteCategory = async (categoryId) => {
    try {
        await db.runAsync('DELETE FROM categories WHERE id = ?', [categoryId]);
        console.log('Category deleted successfully');
        return { success: true };
    } catch (error) {
        console.log('Error deleting category:', error);
        return { success: false, error: error.message };
    }
};

