
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import connectDB from '../config/db.js';

dotenv.config({ path: './.env' });

connectDB();

const categories = [
    { name: 'Burgers', description: 'Delicious crafted burgers' },
    { name: 'Sides', description: 'French fries, wings, and more' },
    { name: 'Beverages', description: 'Soft drinks, water, and juices' },
];

const products = [
    {
        name: 'Classic Cheeseburger',
        sku: 'BURG-001',
        barcode: '10001',
        price: 12.99,
        category: 'Burgers',
        stockQty: 50,
        lowStockThreshold: 10,
        description: 'Juicy beef patty with cheddar cheese',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300',
        isAvailable: true,
    },
    {
        name: 'French Fries',
        sku: 'SIDE-001',
        barcode: '10002',
        price: 4.99,
        category: 'Sides',
        stockQty: 100,
        lowStockThreshold: 20,
        description: 'Crispy golden fries',
        imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=300',
        isAvailable: true,
    },
    {
        name: 'Coca Cola',
        sku: 'BEV-001',
        barcode: '10003',
        price: 2.50,
        category: 'Beverages',
        stockQty: 200,
        lowStockThreshold: 30,
        description: 'Refreshing 330ml can',
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300',
        isAvailable: true,
    },
];

const importData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();

        // Create Admin
        await User.create({
            name: 'Admin User',
            email: 'admin@pos.com',
            password: 'admin123',
            role: 'admin',
        });

        // Create Cashier
        await User.create({
            name: 'Cashier User',
            email: 'cashier@pos.com',
            password: 'cashier123',
            role: 'cashier',
        });

        // Create Categories
        await Category.insertMany(categories);

        // Create Products
        await Product.insertMany(products);

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
