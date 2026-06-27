
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import connectDB from '../config/db.js';

dotenv.config({ path: './.env' });

connectDB();

const categories = [
    { name: 'Burgers', description: 'Juicy beef, chicken, and veggie burgers' },
    { name: 'Sides', description: 'Fries, wedges, wings, and snacks' },
    { name: 'Beverages', description: 'Soft drinks, juices, and hot drinks' },
    { name: 'Desserts', description: 'Sweets and treats' },
    { name: 'Main Dishes', description: 'Rice, pasta, and hearty plates' },
    { name: 'Salads', description: 'Fresh and healthy salads' },
];

const products = [
    {
        name: 'Classic Cheeseburger', sku: 'BURG-001', barcode: '10001',
        price: 1850, category: 'Burgers', stockQty: 50, lowStockThreshold: 10,
        description: 'Juicy beef patty with melted cheddar, lettuce, tomato, and house sauce',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Double Stack Burger', sku: 'BURG-002', barcode: '10002',
        price: 2400, category: 'Burgers', stockQty: 35, lowStockThreshold: 8,
        description: 'Two beef patties, double cheese, bacon, and smoked BBQ sauce',
        imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Chicken Supreme Burger', sku: 'BURG-003', barcode: '10003',
        price: 1950, category: 'Burgers', stockQty: 40, lowStockThreshold: 10,
        description: 'Crispy chicken fillet, coleslaw, pickles, and spicy mayo',
        imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Crispy French Fries', sku: 'SIDE-001', barcode: '10004',
        price: 850, category: 'Sides', stockQty: 200, lowStockThreshold: 40,
        description: 'Golden crispy fries with sea salt',
        imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Spicy Chicken Wings', sku: 'SIDE-002', barcode: '10005',
        price: 1200, category: 'Sides', stockQty: 80, lowStockThreshold: 15,
        description: '8 pcs wings tossed in buffalo and garlic butter sauce',
        imageUrl: 'https://images.unsplash.com/photo-1608039829572-83824acf6d17?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Onion Rings', sku: 'SIDE-003', barcode: '10006',
        price: 750, category: 'Sides', stockQty: 60, lowStockThreshold: 12,
        description: 'Beer-battered onion rings with ranch dip',
        imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512e?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Coca-Cola 330ml', sku: 'BEV-001', barcode: '10007',
        price: 350, category: 'Beverages', stockQty: 300, lowStockThreshold: 50,
        description: 'Ice-cold classic Coca-Cola can',
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Fresh Orange Juice', sku: 'BEV-002', barcode: '10008',
        price: 600, category: 'Beverages', stockQty: 80, lowStockThreshold: 15,
        description: 'Freshly squeezed orange juice, no added sugar',
        imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Iced Coffee', sku: 'BEV-003', barcode: '10009',
        price: 550, category: 'Beverages', stockQty: 100, lowStockThreshold: 20,
        description: 'Cold brew with milk and a dash of vanilla',
        imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Chocolate Brownie', sku: 'DES-001', barcode: '10010',
        price: 950, category: 'Desserts', stockQty: 30, lowStockThreshold: 6,
        description: 'Warm fudgy brownie with vanilla ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Mango Pudding', sku: 'DES-002', barcode: '10011',
        price: 700, category: 'Desserts', stockQty: 25, lowStockThreshold: 5,
        description: 'Creamy mango pudding with fresh fruit topping',
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Chicken Biryani', sku: 'MAIN-001', barcode: '10012',
        price: 2200, category: 'Main Dishes', stockQty: 40, lowStockThreshold: 8,
        description: 'Aromatic basmati rice with spiced chicken and boiled egg',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Creamy Alfredo Pasta', sku: 'MAIN-002', barcode: '10013',
        price: 1950, category: 'Main Dishes', stockQty: 30, lowStockThreshold: 6,
        description: 'Fettuccine in rich parmesan cream sauce with grilled chicken',
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Caesar Salad', sku: 'SAL-001', barcode: '10014',
        price: 1200, category: 'Salads', stockQty: 45, lowStockThreshold: 8,
        description: 'Romaine lettuce, croutons, parmesan, and classic Caesar dressing',
        imageUrl: 'https://images.unsplash.com/photo-1550304916-3dd4f84e91f4?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Greek Salad', sku: 'SAL-002', barcode: '10015',
        price: 1100, category: 'Salads', stockQty: 35, lowStockThreshold: 7,
        description: 'Cucumber, tomato, olives, red onion, and feta cheese',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
    {
        name: 'Fish & Chips', sku: 'MAIN-003', barcode: '10016',
        price: 2500, category: 'Main Dishes', stockQty: 20, lowStockThreshold: 5,
        description: 'Beer-battered fish fillet with thick-cut fries and tartar sauce',
        imageUrl: 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
    },
];

const importData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await Order.deleteMany();

        // Create Users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@pos.com',
            password: 'admin123',
            role: 'admin',
        });

        const cashier = await User.create({
            name: 'Cashier User',
            email: 'cashier@pos.com',
            password: 'cashier123',
            role: 'cashier',
        });

        // Create Categories
        const createdCategories = {};
        for (const cat of categories) {
            const created = await Category.create(cat);
            createdCategories[cat.name] = created._id;
        }

        // Create Products with correct categoryId references
        const createdProducts = {};
        for (const prod of products) {
            const created = await Product.create({
                ...prod,
                categoryId: createdCategories[prod.category],
            });
            createdProducts[prod.name] = created;
        }

        // Helper to build order items from product names
        const buildItems = (names) => names.map(name => {
            const p = createdProducts[name];
            return {
                product: p._id,
                name: p.name,
                qty: 1,
                price: p.price,
                total: p.price,
            };
        });

        const now = new Date();
        const orders = [
            {
                orderNo: `ORD-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-0001`,
                cashier: admin._id,
                cashierName: admin.name,
                items: buildItems(['Classic Cheeseburger', 'Crispy French Fries', 'Coca-Cola 330ml']),
                subtotal: 3050,
                tax: 458,
                total: 3508,
                discount: 0,
                taxBreakdown: [{ name: 'VAT 15%', rate: 0.15, amount: 458 }],
                payment: { method: 'cash', amountPaid: 4000, change: 492 },
                status: 'completed',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 15),
            },
            {
                orderNo: `ORD-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-0002`,
                cashier: cashier._id,
                cashierName: cashier.name,
                items: buildItems(['Chicken Biryani', 'Fresh Orange Juice']),
                subtotal: 2800,
                tax: 420,
                total: 3220,
                discount: 0,
                taxBreakdown: [{ name: 'VAT 15%', rate: 0.15, amount: 420 }],
                payment: { method: 'card', amountPaid: 3220, change: 0 },
                status: 'completed',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 30),
            },
            {
                orderNo: `ORD-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-0003`,
                cashier: admin._id,
                cashierName: admin.name,
                items: buildItems(['Double Stack Burger', 'Spicy Chicken Wings', 'Iced Coffee', 'Chocolate Brownie']),
                subtotal: 6400,
                tax: 960,
                total: 7360,
                discount: 200,
                taxBreakdown: [{ name: 'VAT 15%', rate: 0.15, amount: 960 }],
                payment: { method: 'qr', amountPaid: 7360, change: 0 },
                status: 'completed',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 45),
            },
            {
                orderNo: `ORD-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-0004`,
                cashier: cashier._id,
                cashierName: cashier.name,
                items: buildItems(['Caesar Salad', 'Coca-Cola 330ml']),
                subtotal: 1550,
                tax: 233,
                total: 1783,
                discount: 0,
                taxBreakdown: [{ name: 'VAT 15%', rate: 0.15, amount: 233 }],
                payment: { method: 'cash', amountPaid: 2000, change: 217 },
                status: 'completed',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 10),
            },
            {
                orderNo: `ORD-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-0005`,
                cashier: admin._id,
                cashierName: admin.name,
                items: buildItems(['Fish & Chips', 'Onion Rings', 'Mango Pudding']),
                subtotal: 3950,
                tax: 593,
                total: 4543,
                discount: 0,
                taxBreakdown: [{ name: 'VAT 15%', rate: 0.15, amount: 593 }],
                payment: { method: 'card', amountPaid: 4543, change: 0 },
                status: 'completed',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 20),
            },
            {
                orderNo: `ORD-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-0006`,
                cashier: cashier._id,
                cashierName: cashier.name,
                items: buildItems(['Creamy Alfredo Pasta', 'Iced Coffee']),
                subtotal: 2500,
                tax: 375,
                total: 2875,
                discount: 0,
                taxBreakdown: [{ name: 'VAT 15%', rate: 0.15, amount: 375 }],
                payment: { method: 'cash', amountPaid: 3000, change: 125 },
                status: 'completed',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 13, 0),
            },
            {
                orderNo: `ORD-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-0007`,
                cashier: admin._id,
                cashierName: admin.name,
                items: buildItems(['Chicken Supreme Burger', 'Crispy French Fries', 'Fresh Orange Juice']),
                subtotal: 3800,
                tax: 570,
                total: 4370,
                discount: 0,
                taxBreakdown: [{ name: 'VAT 15%', rate: 0.15, amount: 570 }],
                payment: { method: 'qr', amountPaid: 4370, change: 0 },
                status: 'completed',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 30),
            },
        ];

        await Order.insertMany(orders);

        console.log('Database seeded successfully!');
        console.log(`  Users:      ${(await User.countDocuments())}`);
        console.log(`  Categories: ${(await Category.countDocuments())}`);
        console.log(`  Products:   ${(await Product.countDocuments())}`);
        console.log(`  Orders:     ${(await Order.countDocuments())}`);
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await Order.deleteMany();

        console.log('All data destroyed!');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
