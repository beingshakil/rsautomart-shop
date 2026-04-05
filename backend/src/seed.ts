import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model';
import Category from './models/Category.model';
import Product from './models/Product.model';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({})]);

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@rsautomart.com',
      phone: '+8801700000000',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin user created:', admin.email);

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Car Accessories', slug: 'car-accessories', description: 'Premium car accessories and gadgets', isActive: true },
      { name: 'Bike Accessories', slug: 'bike-accessories', description: 'Motorcycle and bike accessories', isActive: true },
      { name: 'Electronics', slug: 'electronics', description: 'Electronic gadgets and devices', isActive: true },
      { name: 'Tools & Equipment', slug: 'tools-equipment', description: 'Automotive tools and equipment', isActive: true },
      { name: 'Car Care', slug: 'car-care', description: 'Car cleaning and maintenance products', isActive: true },
      { name: 'Lighting', slug: 'lighting', description: 'LED lights, headlights, and lighting accessories', isActive: true },
    ]);
    console.log('Categories created:', categories.length);

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'Premium Car Dash Camera 4K',
        slug: 'premium-car-dash-camera-4k',
        sku: 'SKU-001',
        description: 'High quality 4K dash camera with night vision, GPS tracking, and wide-angle lens. Perfect for recording your drives.',
        shortDescription: '4K Dash Camera with Night Vision & GPS',
        price: 4500,
        discountPrice: 3499,
        category: categories[2]._id,
        brand: 'AutoVision',
        images: [{ url: 'https://placehold.co/800x800/1a1a2e/ffffff?text=Dash+Cam', publicId: 'sample-1' }],
        stock: { quantity: 25, status: 'in_stock' },
        tags: ['dash camera', '4k', 'car electronics'],
        specifications: [
          { key: 'Resolution', value: '4K Ultra HD' },
          { key: 'Night Vision', value: 'Yes' },
          { key: 'Storage', value: 'Up to 128GB SD Card' },
        ],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        warranty: '1 Year Warranty',
        ratings: { average: 4.5, count: 12 },
        totalSold: 45,
      },
      {
        name: 'Universal Car Phone Mount',
        slug: 'universal-car-phone-mount',
        sku: 'SKU-002',
        description: 'Adjustable car phone mount with strong suction cup and 360-degree rotation.',
        shortDescription: '360° Rotatable Car Phone Holder',
        price: 650,
        discountPrice: 450,
        category: categories[0]._id,
        brand: 'MountPro',
        images: [{ url: 'https://placehold.co/800x800/1a1a2e/ffffff?text=Phone+Mount', publicId: 'sample-2' }],
        stock: { quantity: 100, status: 'in_stock' },
        tags: ['phone mount', 'car holder'],
        isFeatured: true,
        isBestSeller: true,
        warranty: '6 Months Warranty',
        ratings: { average: 4.2, count: 28 },
        totalSold: 120,
      },
      {
        name: 'LED Headlight Bulb H4 Pair',
        slug: 'led-headlight-bulb-h4-pair',
        sku: 'SKU-003',
        description: 'Super bright LED headlight bulbs with 12000LM output. Easy plug-and-play installation.',
        shortDescription: '12000LM Super Bright LED Headlights',
        price: 2200,
        discountPrice: 1799,
        category: categories[5]._id,
        brand: 'BrightDrive',
        images: [{ url: 'https://placehold.co/800x800/1a1a2e/ffffff?text=LED+Light', publicId: 'sample-3' }],
        stock: { quantity: 50, status: 'in_stock' },
        variants: [
          { type: 'type', value: 'H4', stock: 20 },
          { type: 'type', value: 'H7', stock: 15 },
          { type: 'type', value: 'H11', stock: 15 },
        ],
        tags: ['led', 'headlight', 'bulb'],
        isFeatured: true,
        isNewArrival: true,
        warranty: '1 Year Warranty',
        ratings: { average: 4.7, count: 35 },
        totalSold: 89,
      },
      {
        name: 'Car Wash Foam Gun Kit',
        slug: 'car-wash-foam-gun-kit',
        sku: 'SKU-004',
        description: 'Professional car wash foam gun with adjustable foam concentration. Includes 500ml car shampoo.',
        shortDescription: 'Professional Foam Gun + Shampoo Kit',
        price: 1800,
        discountPrice: 1299,
        category: categories[4]._id,
        brand: 'CleanRide',
        images: [{ url: 'https://placehold.co/800x800/1a1a2e/ffffff?text=Foam+Gun', publicId: 'sample-4' }],
        stock: { quantity: 30, status: 'in_stock' },
        tags: ['car wash', 'foam gun', 'car care'],
        isBestSeller: true,
        warranty: '30 Days Return',
        ratings: { average: 4.3, count: 18 },
        totalSold: 67,
      },
      {
        name: 'Motorcycle Phone Holder Waterproof',
        slug: 'motorcycle-phone-holder-waterproof',
        sku: 'SKU-005',
        description: 'Waterproof motorcycle phone holder with touch screen support. Fits all bikes.',
        shortDescription: 'Waterproof Bike Phone Holder',
        price: 850,
        discountPrice: 599,
        category: categories[1]._id,
        brand: 'BikeGear',
        images: [{ url: 'https://placehold.co/800x800/1a1a2e/ffffff?text=Bike+Holder', publicId: 'sample-5' }],
        stock: { quantity: 3, status: 'low_stock' },
        tags: ['bike holder', 'waterproof', 'motorcycle'],
        isNewArrival: true,
        warranty: '7 Days Replacement',
        ratings: { average: 4.0, count: 9 },
        totalSold: 34,
      },
      {
        name: 'Professional OBD2 Scanner',
        slug: 'professional-obd2-scanner',
        sku: 'SKU-006',
        description: 'Advanced OBD2 diagnostic scanner. Read and clear engine codes. Works with all vehicles 1996+.',
        shortDescription: 'OBD2 Car Diagnostic Scanner',
        price: 3500,
        discountPrice: 2799,
        category: categories[3]._id,
        brand: 'DiagPro',
        images: [{ url: 'https://placehold.co/800x800/1a1a2e/ffffff?text=OBD+Scanner', publicId: 'sample-6' }],
        stock: { quantity: 15, status: 'in_stock' },
        tags: ['obd2', 'scanner', 'diagnostic'],
        isFeatured: true,
        warranty: '1 Year Warranty',
        ratings: { average: 4.6, count: 22 },
        totalSold: 55,
      },
    ]);
    console.log('Products created:', products.length);

    console.log('\n--- Seed Complete ---');
    console.log('Admin Login: admin@rsautomart.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
