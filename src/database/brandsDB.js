import db from './db';

//Adding a brand

export const addBrand = async (brandName) => {
    try {
        const result = await db.runAsync(
            `INSERT INTO brands (brand_name) VALUES (?)`,
            [brandName]
        );
        console.log ('Brand added successfully with ID:', result.lastInsertRowId);
        return { success: true, brandId: result.lastInsertRowId };
    } catch (error) {
        console.log('Error adding brand:', error);
        return { success: false, error: error.message };
    }
};

//getting all brands
export const getAllBrands = async() => {
    try {
        const result = await db.getAllAsync(
            `SELECT * FROM brands ORDER BY brand_name`
        );

        return { success: true, brands: result };
    } catch (error) {
        console.log('Error getting brands:', error );
        return { success: false, error: error.message };
    }
};

//Deleting brand
export const deleteBrand = async (brandId) => {
    try {
        await db.runAsync('DELETE FROM brands WHERE id = ', [brandId]);
        console.log('Brand deleted successfully');
        return { success:true };
    } catch (error) {
        console.log('Error deleting brand:', error);
        return { success: false, error: error.message };
    }
};