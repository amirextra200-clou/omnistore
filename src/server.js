const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// File paths
const DATA_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Helper to generate dynamic SVG Placeholder Route
app.get('/api/placeholder/:category/:text', (req, res) => {
    const { category, text } = req.params;
    
    const categoryColors = {
        'Electronics': { bg: '#0f172a', accent: '#38bdf8', icon: '⚡' },
        'Watches': { bg: '#1e1b4b', accent: '#818cf8', icon: '⌚' },
        'Skincare': { bg: '#831843', accent: '#f472b6', icon: '✨' },
        'Hair Care': { bg: '#064e3b', accent: '#34d399', icon: '🌿' },
        'Fashion': { bg: '#312e81', accent: '#a78bfa', icon: '👔' },
        'Groceries': { bg: '#78350f', accent: '#fbbf24', icon: '🛒' }
    };

    const style = categoryColors[category] || { bg: '#1e293b', accent: '#94a3b8', icon: '📦' };

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="${style.bg}" />
        <circle cx="200" cy="110" r="45" fill="${style.accent}" opacity="0.2" />
        <text x="200" y="125" font-size="42" text-anchor="middle" fill="${style.accent}">${style.icon}</text>
        <text x="200" y="200" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#ffffff">${decodeURIComponent(text)}</text>
        <rect x="150" y="230" width="100" height="25" rx="12" fill="${style.accent}" opacity="0.9" />
        <text x="200" y="247" font-family="Arial, sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#000000">${category.toUpperCase()}</text>
    </svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});

// Helper function to create default products file with exactly 10 items per category
function createDefaultProductsFile() {
    const categories = [
        { 
            name: "Electronics", 
            items: [
                "Wireless RGB Gaming Mouse", "Mechanical Gaming Keyboard", "Noise Cancelling Headphones", 
                "Ultra HD 4K Gaming Monitor", "Bluetooth Portable Speaker", "Fast Wireless Charging Pad", 
                "1080p HD Webcam with Mic", "RGB LED Desk Light Bar", "Type-C Multi-Port Hub Adapter", "Foldable Drone with HD Camera"
            ] 
        },
        { 
            name: "Watches", 
            items: [
                "Smart Fitness Watch Series 7", "Classic Leather Chronograph Watch", "Luxury Stainless Steel Analog Watch", 
                "Sport Waterproof Digital Watch", "Minimalist Quartz Wrist Watch", "Automatic Skeleton Mechanical Watch", 
                "Hybrid Smart Watch with Heart Rate Sensor", "Rose Gold Executive Ladies Watch", "Tactical Military Military Style Watch", "Vintage Retro Digital Watch"
            ] 
        },
        { 
            name: "Skincare", 
            items: [
                "Hydrating Facial Cream", "Vitamin C Glow Serum", "Aloe Vera Soothing Gel", 
                "Exfoliating Face Scrub Mask", "Anti-Aging Night Repair Cream", "Hyaluronic Acid Hydrating Toner", 
                "Daily Mineral Sunscreen SPF 50+", "Under Eye Dark Circle Cream", "Charcoal Deep Cleansing Mud Mask", "Organic Rose Water Facial Spray"
            ] 
        },
        { 
            name: "Hair Care", 
            items: [
                "Nourishing Hair Shampoo", "Argan Hair Conditioning Oil", "Keratin Smooth Hair Mask", 
                "Anti-Dandruff Scalp Treatment", "Organic Onion Hair Growth Serum", "Professional Hair Styling Gel", 
                "Heat Protectant Hair Spray", "Biotin Strengthening Conditioner", "Natural Coconut Hair Oil", "Leave-In Silk Repair Serum"
            ] 
        },
        { 
            name: "Fashion", 
            items: [
                "Men Casual Cotton Shirt", "Classic Denim Blue Jacket", "Slim Fit Stretch Chino Pants", 
                "Oversized Graphic Hoodie", "Formal Executive Blazer", "Unisex Cotton Crewneck T-Shirt", 
                "Winter Thermal Zip-Up Jacket", "Classic Leather Belt", "Athletic Running Track Pants", "Casual Summer Linen Shorts"
            ] 
        },
        { 
            name: "Groceries", 
            items: [
                "Organic Honey Jar (1kg)", "Extra Virgin Olive Oil (1L)", "Premium Almond Nuts Pack (500g)", 
                "Dark Roasted Coffee Beans (1kg)", "Pure Organic Green Tea Bags", "Natural Peanut Butter Crunchy", 
                "Himalayan Pink Salt Fine (1kg)", "Mixed Dry Fruits Assortment", "Organic Rolled Oats (1kg)", "Artisanal Dark Chocolate Bar"
            ] 
        }
    ];

    let initialProducts = [];
    let idCounter = 1;

    categories.forEach(cat => {
        cat.items.forEach(itemName => {
            initialProducts.push({
                id: idCounter++,
                name: itemName,
                price: parseFloat((Math.random() * 80 + 10).toFixed(2)),
                category: cat.name,
                stock: Math.floor(Math.random() * 30) + 10,
                image: `/api/placeholder/${encodeURIComponent(cat.name)}/${encodeURIComponent(itemName)}`
            });
        });
    });

    fs.writeFileSync(DATA_FILE, JSON.stringify(initialProducts, null, 2));
    return initialProducts;
}

function getProducts() {
    if (!fs.existsSync(DATA_FILE)) {
        return createDefaultProductsFile();
    }
    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf8').trim();
        if (!fileContent) return createDefaultProductsFile();
        return JSON.parse(fileContent);
    } catch (error) {
        return createDefaultProductsFile();
    }
}

function saveProducts(products) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

function getOrders() {
    if (!fs.existsSync(ORDERS_FILE)) {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
        return [];
    }
    try {
        const fileContent = fs.readFileSync(ORDERS_FILE, 'utf8').trim();
        if (!fileContent) return [];
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

function saveOrders(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

let activeCart = [];

// PRODUCTS API
app.get('/api/products', (req, res) => {
    const products = getProducts();
    res.json({ success: true, data: products });
});

app.post('/api/products', (req, res) => {
    const { name, price, category, stock, image } = req.body;
    if (!name || !price || !category || !stock) {
        return res.status(400).json({ success: false, message: "Tamam fields fill karna zaroori hain!" });
    }

    let products = getProducts();
    const productImage = image && image.trim() !== "" ? image : `/api/placeholder/${encodeURIComponent(category)}/${encodeURIComponent(name)}`;

    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        image: productImage
    };

    products.push(newProduct);
    saveProducts(products);

    res.status(201).json({ success: true, message: "Product successfully add ho gaya!", data: newProduct });
});

app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    let products = getProducts();
    const filteredProducts = products.filter(p => p.id !== productId);

    if (products.length === filteredProducts.length) {
        return res.status(404).json({ success: false, message: "Product nahi mila!" });
    }

    saveProducts(filteredProducts);
    res.json({ success: true, message: "Product kamyabi se delete ho gaya!" });
});

app.post('/api/products/clear', (req, res) => {
    saveProducts([]);
    res.json({ success: true, message: "Tamam products clear ho gaye hain!" });
});

// CART API
app.get('/api/cart', (req, res) => {
    res.json({ success: true, cart: activeCart });
});

app.post('/api/cart/add', (req, res) => {
    const { productId, quantity } = req.body;
    const products = getProducts();
    const product = products.find(p => p.id === parseInt(productId));

    if (!product) {
        return res.status(404).json({ success: false, message: "Product nahi mila!" });
    }

    const existingItem = activeCart.find(item => item.productId === parseInt(productId));
    if (existingItem) {
        existingItem.quantity += quantity ? parseInt(quantity) : 1;
    } else {
        activeCart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity ? parseInt(quantity) : 1
        });
    }

    res.json({ success: true, message: "Cart update ho gaya!", cart: activeCart });
});

app.post('/api/cart/update', (req, res) => {
    const { productId, quantity } = req.body;
    const item = activeCart.find(i => i.productId === parseInt(productId));

    if (item) {
        if (parseInt(quantity) <= 0) {
            activeCart = activeCart.filter(i => i.productId !== parseInt(productId));
        } else {
            item.quantity = parseInt(quantity);
        }
    }

    res.json({ success: true, message: "Quantity update ho gayi!", cart: activeCart });
});

app.post('/api/cart/remove', (req, res) => {
    const { productId } = req.body;
    activeCart = activeCart.filter(item => item.productId !== parseInt(productId));
    res.json({ success: true, message: "Item cart se remove kar diya gaya!", cart: activeCart });
});

app.post('/api/cart/checkout', (req, res) => {
    if (activeCart.length === 0) {
        return res.status(400).json({ success: false, message: "Cart khali hai!" });
    }

    const orders = getOrders();
    const newOrder = {
        orderId: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: [...activeCart],
        totalAmount: activeCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    orders.push(newOrder);
    saveOrders(orders);

    activeCart = [];

    res.json({ 
        success: true, 
        message: `Order #${newOrder.orderId} kamyabi se place aur save ho gaya hai! 🎉`,
        orderId: newOrder.orderId 
    });
});

app.get('/api/orders', (req, res) => {
    const orders = getOrders();
    res.json({ success: true, orders: orders });
});

app.listen(PORT, () => {
    console.log(`🚀 OmniStore Server running on http://localhost:${3000}`);
});