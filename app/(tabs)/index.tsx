/*import { addBrand, getAllBrands } from '@/src/database/brandsDB';
import { addCategory, getAllCategories } from '@/src/database/categoriesDB';
import { initDatabase } from '@/src/database/db';
import { addExpense, getAllExpenses } from '@/src/database/expensesDB';
import { addProduct, getAllProducts } from '@/src/database/productsDB';
import { calculateProfit, getFinancialReport, getInventoryReport, getLowStockReport, getSalesReport, getTopSellingProducts } from '@/src/database/reportsDB';
import { getAllRestocks, getLowStockProducts, recordRestock } from '@/src/database/restocksDB';
import { getAllSales, getDailySales, recordSale } from '@/src/database/salesDB';
import { getLowStockThreshold, getSettings, initializeSettings, updateSettings } from '@/src/database/settingsDB';
import { useEffect } from "react";
import { Text, View } from 'react-native';

export default function HomeScreen() {
    useEffect(() => {
        const testAllFunctions = async () => {
            try {
                console.log("Testing database...");
                await initDatabase();
                console.log("Database ready!");
                
                // Test to add categories
                console.log("Testing categories...");
                await addCategory("Phone Cases");
                await addCategory("Screen Protectors");
                await addCategory("Smart Watches");
                
                const categoriesResult = await getAllCategories();
                if (categoriesResult.success) {
                    console.log("Categories:", categoriesResult.categories);
                }
                
                // Test to add brands
                console.log("Testing brands...");
                await addBrand("Apple");
                await addBrand("Samsung");
                await addBrand("Generic");
                
                const brandsResult = await getAllBrands();
                if (brandsResult.success) {
                    console.log("Brands:", brandsResult.brands);
                }
                
                // Testing to add a product with proper category and brand
                console.log("Testing to add a  product with real categories...");
                const productResult = await addProduct({
                    name: "Samsung Galaxy Case",
                    category_id: 1, 
                    brand_id: 2,    
                    buying_price: 100.00,
                    selling_price: 300.00,
                    quantity_in_stock: 10,
                    image_uri: null
                });
                
                if (productResult.success) {
                    console.log("Product added with proper category and brand!");
                    
                    // Getting all products
                    const productsResult = await getAllProducts();
                    if (productsResult.success) {
                        console.log("All Products with details:", productsResult.products);
                    }
                }

                //Test to record a sale

                console.log("Testing sales recording...");
                const saleResult = await recordSale({
                    product_id: 1,
                    quantity_sold: 3,
                    selling_price_at_time: 200.00
                });

                if (saleResult.success) {
                    console.log("Sale recorded successfully");

                    //Test to get all sales
                    const saleResult = await getAllSales();
                    if (saleResult.success) {
                        console.log("All Sales:", saleResult.sales);
                    }
                    //Testing daily sales
                    const dailyResult = await getDailySales();
                    if (dailyResult.success) {
                        console.log("Daily Sales Summary:", dailyResult.dailySales);
                    }

                    //checking updated product stock
                    const updatedProducts = await getAllProducts();
                    console.log("Updated Products Stock:", updatedProducts.products);
                }

                // Getting currrent prodcuts to see stock levels
                const products = await getAllProducts();
                if (products.success && products.products) {
                    console.log("Current products stock:", products.products.map(p => ({ 
                        id: p.id, 
                        name: p.name, 
                        stock: p.quantity_in_stock 
                    })));
                } else {
                    console.log("Failed to get products:", products.error);
                    return;
                }

                // Test recording a restock for product with low stock
                console.log("Testing restock recording...");
                const restockResult = await recordRestock({
                    product_id: 1, 
                    quantity_added: 20,
                    cost_price: 150.00
                });

                if (restockResult.success) {
                    console.log("Restock recorded successfully!");

                    // Test getting all restocks
                    const restocksResult = await getAllRestocks();
                    if (restocksResult.success && restocksResult.restocks) {
                        console.log("All Restocks:", restocksResult.restocks);
                    } else {
                        console.log("Failed to get restocks:", restocksResult.error);
                    }

                    // Test getting low stock products
                    const lowStockResult = await getLowStockProducts(10);
                    if (lowStockResult.success && lowStockResult.lowStockProducts) {
                        console.log("Low Stock Products:", lowStockResult.lowStockProducts);
                    } else {
                        console.log("Failed to get low stock products:", lowStockResult.error);
                    }

                    // Check updated product stock
                    const updatedProducts = await getAllProducts();
                    if (updatedProducts.success && updatedProducts.products) {
                        console.log("Updated Products Stock:", updatedProducts.products.map(p => ({ 
                            id: p.id, 
                            name: p.name, 
                            stock: p.quantity_in_stock 
                        })));
                    } else {
                        console.log("Failed to get updated products:", updatedProducts.error);
                    }
                } else {
                    console.log("Failed to record restock:", restockResult.error);
                }

                //Test to add expenses
                console.log("Testing espenses recording...");

                await addExpense({
                    reason: "Shop Rent",
                    amount: 8000.00
                });

                await addExpense({
                    reason: "Electricity Bill",
                    amount: 4000.00
                });

                await addExpense({
                    reason: "Transportation",
                    amount: 2000.00
                });

                //Test to get all expenses
                const expensesResult = await getAllExpenses();
                if (expensesResult.success && expensesResult.expenses) {
                    console.log("All Expenses:", expensesResult.expenses);
                }

                //Test for profit calculation
                const today = new Date().toISOString().split('T')[0];
                const profitResult = await calculateProfit(today, today);

                if (profitResult.success) {
                    console.log("Today's Profit Analysis:", profitResult.profitData);
                } else {
                    console.log("Failed to calculate profit:", profitResult.error);
                }

                //Initializing settings if they do not exist
                console.log("Initializing settings...");
                const initResult = await initializeSettings();
                if (initResult.success) {
                    console.log("Settings initialized successfully");
                }

                //Getting current settings
                console.log("Getting current settings...");
                const settingsResult = await getSettings();
                if (settingsResult.success && settingsResult.settings) {
                    console.log("Current settings:", settingsResult.settings);
                }

                //Testing updated settings
                console.log("Testing settings update...");
                const updateResult = await updateSettings({
                    shop_name: "Paul's Phone Accessories",
                    currency: "KSH",
                    default_low_stock_threshold: 5,
                    theme: "dark",
                    owner_name: "Paul Muiruri"
                });
                if (updateResult.success) {
                    console.log("Settings updated successfully");

                    //Getting updated settings
                    const updatedSettings = await getSettings();
                    if (updatedSettings.success && updatedSettings.settings) {
                        console.log("Updated settings:", updatedSettings.settings);
                    }

                    //Testing low stock threshold
                    const thresholdResult = await getLowStockThreshold();
                    if (thresholdResult.success) {
                        console.log("Low Stock Threshold:", thresholdResult.threshold);
                    }
                }

                const todayy = new Date().toISOString().split('T')[0];

                //Testing Sales Report
                console.log("Testing Sales Report..");

                console.log("Testing daily sales Report...");
                const dailySales = await getSalesReport('daily');
                if(dailySales.success) {
                    console.log("Daily Sales Report:", dailySales.salesData);
                }

                console.log("Testing weekly Sales report..");
                const weeklySales = await getSalesReport('weekly');
                if (weeklySales.success) {
                    console.log("Weekly Sales Report:", weeklySales.salesData);
                }

                //Testing Inventory Report
                console.log("Testing Inventory Report");
                const inventoryReport = await getInventoryReport();
                if (inventoryReport.success) {
                    console.log("Inventory Summary:", inventoryReport.summary);
                    console.log("Inventory Items:", inventoryReport.inventory);
                }

                //Testing financial report
                console.log("Testing financial report");
                const financialReport = await getFinancialReport(today, today);
                if (financialReport.success) {
                    console.log("Financial Report:", financialReport.financialData);
                }

                //Testing low stock report
                console.log("Testing Low Stock Report");
                const lowStockReport = await getLowStockReport();
                if (lowStockReport.success) {
                    console.log("Low Stock Threshold:", lowStockReport.threshold);
                    console.log("Low Stock Products:", lowStockReport.lowStockProducts);
                }

                //Testing top selling products
                console.log("Testing Top Selling Products");
                const topProducts = await getTopSellingProducts(2);
                if (topProducts.success){
                    console.log("Top Selling Products:", topProducts.topProducts);
                }

                console.log("ALL REPORTS TESTED SUCCESSFULLY!");
                
            } catch (error) {
                console.log("Error:", error);
            }

            
        };
        
        testAllFunctions();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Testing Categories, Brands, and Sales and products Functions...</Text>
            <Text>Testing Expenses & Profit Functions</Text>
            <Text>Testing Settings Functions...</Text>
            <Text>Testing Comprehensive Reports System...</Text>
        </View>
        
    );
}*/


import { initDatabase } from '@/src/database/db';
import {
    getFinancialReport,
    getInventoryReport,
    getLowStockReport,
    getSalesReport,
    getTopSellingProducts
} from '@/src/database/reportsDB';
import { useEffect } from "react";
import { Text, View } from 'react-native';

export default function HomeScreen() {
    useEffect(() => {
        const testReportsFunctions = async () => {
            try {
                console.log("Testing database...");
                await initDatabase();
                console.log("Database ready!");

                const today = new Date().toISOString().split('T')[0];

                //Sales Reports
                console.log("Testing Sales");
                
                console.log("Testing daily sales report...");
                const dailySales = await getSalesReport('daily');
                if (dailySales.success) {
                    console.log("Daily Sales Report:", dailySales.salesData);
                }

                console.log("Testing weekly sales report...");
                const weeklySales = await getSalesReport('weekly');
                if (weeklySales.success) {
                    console.log("Weekly Sales Report:", weeklySales.salesData);
                }

                //Inventory Report
                console.log("Testing inventory report");
                const inventoryReport = await getInventoryReport();
                if (inventoryReport.success) {
                    console.log("Inventory Summary:", inventoryReport.summary);
                    console.log("Inventory Items:", inventoryReport.inventory);
                } else {
                    console.log("Inventory Report Error:", inventoryReport.error);
                }

                //Financial Report
                console.log("Testing financial report");
                const financialReport = await getFinancialReport(today, today);
                if (financialReport.success) {
                    console.log("Financial Report:", financialReport.financialData);
                } else {
                    console.log("Financial Report Error:", financialReport.error);
                }

                //Low Stock Report
                console.log("Testing low stock report");
                const lowStockReport = await getLowStockReport();
                if (lowStockReport.success) {
                    console.log("Low Stock Threshold:", lowStockReport.threshold);
                    console.log("Low Stock Products:", lowStockReport.lowStockProducts);
                }

                //Top Selling Products
                console.log("Testing top selling products");
                const topProducts = await getTopSellingProducts(3);
                if (topProducts.success) {
                    console.log("Top Selling Products:", topProducts.topProducts);
                }

                console.log("Tested all reports");

            } catch (error) {
                console.log("Error:", error);
            }
        };

        testReportsFunctions();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Testing Comprehensive Reports System...</Text>
        </View>
    );
}