
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import connectDB from '../config/db.js';

dotenv.config({ path: './.env' });

connectDB();

const categories = [
    { name: 'Burgers', description: 'Delicious crafted burgers' },
    { name: 'Sides', description: 'French fries, wings, and more' },
    { name: 'Beverages', description: 'Soft drinks, water, and juices' },
    { name: 'Desserts', description: 'Sweet treats and bakery items' },
    { name: 'Meals', description: 'Rice bowls, platters, and combos' },
];

const products = [
    {
        name: 'Classic Cheeseburger',
        price: 12.99,
        category: 'Burgers',
        stockQty: 50,
        description: 'Juicy beef patty with cheddar cheese',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300',
    },
    {
        name: 'French Fries',
        price: 4.99,
        category: 'Sides',
        stockQty: 100,
        description: 'Crispy golden fries',
        imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=300',
    },
    {
        name: 'Coca Cola',
        price: 2.50,
        category: 'Beverages',
        stockQty: 200,
        description: 'Refreshing 330ml can',
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300',
    },
    {
        name: 'Chicken Burger',
        price: 11.99,
        category: 'Burgers',
        stockQty: 42,
        description: 'Grilled chicken with fresh lettuce',
        imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e5cda1d7?auto=format&fit=crop&q=80&w=300',
    },
    {
        name: 'Loaded Fries',
        price: 6.99,
        category: 'Sides',
        stockQty: 75,
        description: 'Fries topped with cheese and sauce',
        imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=300',
    },
    {
        name: 'Iced Lemon Tea',
        price: 3.25,
        category: 'Beverages',
        stockQty: 120,
        description: 'Cold brewed tea with lemon',
        imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=300',
    },
    {
        name: 'Chocolate Cake',
        price: 5.50,
        category: 'Desserts',
        stockQty: 30,
        description: 'Rich chocolate sponge with ganache',
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300',
    },
    {
        name: 'Chicken Rice Bowl',
        price: 9.75,
        category: 'Meals',
        stockQty: 55,
        description: 'Rice bowl with grilled chicken and vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=300',
    },
];

const orderSeeds = [
    { daysAgo: 0, total: 38.98, method: 'cash', status: 'completed', cashierName: 'Cashier User', items: [['Classic Cheeseburger', 1], ['French Fries', 2], ['Coca Cola', 1]] },
    { daysAgo: 0, total: 24.49, method: 'card', status: 'completed', cashierName: 'Cashier User', items: [['Chicken Burger', 1], ['Iced Lemon Tea', 1], ['Loaded Fries', 1]] },
    { daysAgo: 1, total: 19.99, method: 'qr', status: 'completed', cashierName: 'Cashier User', items: [['Chicken Rice Bowl', 2]] },
    { daysAgo: 1, total: 14.49, method: 'cash', status: 'completed', cashierName: 'Cashier User', items: [['Classic Cheeseburger', 1], ['Coca Cola', 1]] },
    { daysAgo: 2, total: 9.99, method: 'card', status: 'pending', cashierName: 'Cashier User', items: [['French Fries', 1], ['Iced Lemon Tea', 2]] },
    { daysAgo: 3, total: 26.48, method: 'cash', status: 'completed', cashierName: 'Cashier User', items: [['Chicken Burger', 1], ['Loaded Fries', 1], ['Coca Cola', 2]] },
    { daysAgo: 4, total: 15.49, method: 'qr', status: 'completed', cashierName: 'Cashier User', items: [['Chocolate Cake', 1], ['Iced Lemon Tea', 2]] },
    { daysAgo: 5, total: 44.97, method: 'card', status: 'completed', cashierName: 'Cashier User', items: [['Chicken Rice Bowl', 3], ['Coca Cola', 3]] },
    { daysAgo: 6, total: 12.99, method: 'cash', status: 'cancelled', cashierName: 'Cashier User', items: [['Classic Cheeseburger', 1]] },
    { daysAgo: 7, total: 21.98, method: 'qr', status: 'completed', cashierName: 'Cashier User', items: [['Loaded Fries', 2], ['Coca Cola', 2]] },
    { daysAgo: 8, total: 17.75, method: 'cash', status: 'completed', cashierName: 'Cashier User', items: [['Chicken Rice Bowl', 1], ['Iced Lemon Tea', 1]] },
    { daysAgo: 10, total: 32.47, method: 'card', status: 'completed', cashierName: 'Cashier User', items: [['Chicken Burger', 2], ['Chocolate Cake', 1]] },
];

const importData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await Order.deleteMany();

        // Create Admin
        await User.create({
            name: 'Admin User',
            email: 'admin@pos.com',
            password: 'admin123',
            role: 'admin',
        });

        // Create Cashier
        const cashierUser = await User.create({
            name: 'Cashier User',
            email: 'cashier@pos.com',
            password: 'cashier123',
            role: 'cashier',
        });

        // Create Categories
        await Category.insertMany(categories);

        // Create Products
        const createdProducts = await Product.insertMany(products);

        const productByName = new Map(createdProducts.map((product) => [product.name, product]));

        const today = new Date();
        for (let i = 0; i < orderSeeds.length; i += 1) {
            const seed = orderSeeds[i];
            const createdAt = new Date(today);
            createdAt.setDate(createdAt.getDate() - seed.daysAgo);
            createdAt.setHours(9 + (i % 8), (i * 11) % 60, 0, 0);

            const items = seed.items.map(([name, qty]) => {
                const product = productByName.get(name);
                const price = product.price;
                const total = Number((price * qty).toFixed(2));
                return {
                    product: product._id,
                    name: product.name,
                    qty,
                    price,
                    total,
                };
            });

            const subtotal = Number(items.reduce((sum, item) => sum + item.total, 0).toFixed(2));
            const tax = Number((subtotal * 0.08).toFixed(2));
            const discount = seed.status === 'completed' && i % 4 === 0 ? 1.5 : 0;
            const total = Number((subtotal + tax - discount).toFixed(2));
            const amountPaid = seed.status === 'completed' ? total : Number((total / 2).toFixed(2));

            await Order.create({
                orderNo: `ORD-SEED-${String(i + 1).padStart(3, '0')}`,
                cashier: cashierUser._id,
                cashierName: seed.cashierName,
                items,
                subtotal,
                tax,
                discount,
                total,
                payment: {
                    method: seed.method,
                    amountPaid,
                    change: seed.status === 'completed' ? Number((amountPaid - total).toFixed(2)) : 0,
                },
                status: seed.status,
                createdAt,
                updatedAt: createdAt,
            });
        }

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await Order.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
