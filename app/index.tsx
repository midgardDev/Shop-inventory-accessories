/*import { useEffect } from "react";
import { Text, View } from 'react-native';
import { initDatabase } from '../src/database/db';
import { addProduct, getAllProducts } from '../src/database/productsDB';

export default function HomeScreen() {
    useEffect(() => {
        const testDatabase = async () => {
            try {
                console.log("Testing database creation...");
                await initDatabase();
                console.log("Database setup completed successfully!");
            } catch (error) {
                console.log("Database error:", error);
            }
        };
        
        testDatabase();

        const testProducts = async () => {
            try {
                console.log("Testing database...");
                await initDatabase();
                console.log('Database ready!');

                // test to add a new product

                console.log("Testing adding a product....");
                const result = await addProduct({
                    name: "iPhone 15 Pro Case",
                    category_id: 1,
                    brand_id: 1,
                    buying_price: 100.00,
                    selling_price: 300.00,
                    quantity_in_stock: 10,
                    image_uri: null
                });

                if (result.success) {
                    console.log("Product added successfully");

                    //Test to get all products
                    const productsResult = await getAllProducts();
                    if (productsResult.success) {
                        console.log("Products retrieved:", productsResult.products);
                    }
                }
            } catch (error) {
                console.log("Error:", error);
            }
        };
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Testing Database Creation...</Text>
        </View>
    );
    

}*/

import { initDatabase } from '@/src/database/db';
import { getAllProducts } from '@/src/database/productsDB';
import { getAllRestocks, getLowStockProducts, recordRestock } from '@/src/database/restocksDB';
import { useEffect } from "react";
import { Text, View } from 'react-native';

export default function HomeScreen() {
    useEffect(() => {
        const testRestocksFunctions = async () => {
            try {
                console.log("Testing database...");
                await initDatabase();
                console.log("Database ready!");

                // Get current products to see stock levels
                const products = await getAllProducts();
                if (products.success && products.products) {
                    console.log("Current products stock:", products.products.map(p => ({ 
                        id: p.id, 
                        name: p.name, 
                        stock: p.quantity_in_stock 
                    })));
                } else {
                    console.log("❌ Failed to get products:", products.error);
                    return;
                }

                // Test recording a restock for product with low stock (ID 1 has 6 items)
                console.log("Testing restock recording...");
                const restockResult = await recordRestock({
                    product_id: 1, // Product with low stock
                    quantity_added: 20,
                    cost_price: 4.50
                });

                if (restockResult.success) {
                    console.log("✅ Restock recorded successfully!");

                    // Test getting all restocks
                    const restocksResult = await getAllRestocks();
                    if (restocksResult.success && restocksResult.restocks) {
                        console.log("✅ All Restocks:", restocksResult.restocks);
                    } else {
                        console.log("❌ Failed to get restocks:", restocksResult.error);
                    }

                    // Test getting low stock products
                    const lowStockResult = await getLowStockProducts(10);
                    if (lowStockResult.success && lowStockResult.lowStockProducts) {
                        console.log("✅ Low Stock Products:", lowStockResult.lowStockProducts);
                    } else {
                        console.log("❌ Failed to get low stock products:", lowStockResult.error);
                    }

                    // Check updated product stock
                    const updatedProducts = await getAllProducts();
                    if (updatedProducts.success && updatedProducts.products) {
                        console.log("✅ Updated Products Stock:", updatedProducts.products.map(p => ({ 
                            id: p.id, 
                            name: p.name, 
                            stock: p.quantity_in_stock 
                        })));
                    } else {
                        console.log("❌ Failed to get updated products:", updatedProducts.error);
                    }
                } else {
                    console.log("❌ Failed to record restock:", restockResult.error);
                }

            } catch (error) {
                console.log("Error:", error);
            }
        };

        testRestocksFunctions();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Testing Restocks Functions...</Text>
        </View>
    );
}


/*port { useEffect } from "react";
import { Text, View } from 'react-native';
import { initDatabase } from '../src/database/db';
import { addProduct, getAllProducts } from '../src/database/productsDB';

export default function HomeScreen() {
    useEffect(() => {
        const testProducts = async () => {
            try {
                console.log("Testing database...");
                await initDatabase();
                console.log("Database ready!");
                
                // Test adding a product
                console.log("Testing add product...");
                const result = await addProduct({
                    name: "iPhone 15 Pro Case",
                    category_id: 1,
                    brand_id: 1,
                    buying_price: 5.00,
                    selling_price: 15.00,
                    quantity_in_stock: 50,
                    image_uri: null
                });
                
                if (result.success) {
                    console.log("✅ Product added successfully!");
                    
                    // Test getting all products
                    const productsResult = await getAllProducts();
                    if (productsResult.success) {
                        console.log("✅ Products retrieved:", productsResult.products);
                    }
                }
                
            } catch (error) {
                console.log("Error:", error);
            }
        };
        
        testProducts();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Testing Products Database Functions...</Text>
        </View>
    );
}*/