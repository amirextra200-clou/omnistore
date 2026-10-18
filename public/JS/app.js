// ======================================================
// OMNISTORE: FRONTEND STOREFRONT, AI CHAT & CART SYSTEM
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    initCartUI();
});

let allProducts = [];
let cart = [];

// 1. Fetch & Render All Products on Page Load
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const result = await response.json();
        if (result.success) {
            allProducts = result.data;
            renderProductsGrid(allProducts);
        }
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// 2. Render Main Storefront Grid
function renderProductsGrid(productsList, highlightedId = null) {
    const gridContainer = document.getElementById("product-grid");
    if (!gridContainer) return;

    gridContainer.innerHTML = "";

    productsList.forEach(product => {
        const isHighlighted = product.id === highlightedId;
        
        const productCard = document.createElement("div");
        productCard.style.cssText = `
            border: ${isHighlighted ? '3px solid #007bff' : '1px solid #ddd'};
            box-shadow: ${isHighlighted ? '0 0 15px rgba(0, 123, 255, 0.5)' : '0 2px 5px rgba(0,0,0,0.1)'};
            transition: all 0.4s ease;
            position: relative;
            padding: 15px;
            border-radius: 8px;
            background: #fff;
        `;

        productCard.innerHTML = `
            ${isHighlighted ? '<span style="position: absolute; top: 10px; right: 10px; background: #007bff; color: white; padding: 3px 8px; font-size: 11px; border-radius: 12px; font-weight: bold;">AI Picked ✨</span>' : ''}
            <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 6px;">
            <h3 style="margin: 10px 0 5px 0; font-size: 16px;">${product.name}</h3>
            <p style="color: #666; font-size: 13px; margin-bottom: 8px;">${product.category}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 16px; color: #28a745;">$${product.price}</span>
                <button onclick="addToCart(${product.id})" style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Add to Cart</button>
            </div>
        `;

        gridContainer.appendChild(productCard);
    });
}

// 3. Send Message to Groq AI Endpoint
async function sendChatMessage() {
    const inputElem = document.getElementById("chat-input");
    const message = inputElem.value.trim();

    if (!message) return;

    appendMessage("user", message);
    inputElem.value = "";

    try {
        const response = await fetch('/api/ai-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        if (data.success) {
            appendMessage("ai", data.reply);

            if (data.matchedProducts && data.matchedProducts.length > 0) {
                const matched = data.matchedProducts[0];
                appendChatProductCard(matched);

                const remainingProducts = allProducts.filter(p => p.id !== matched.id);
                const reorderedProducts = [matched, ...remainingProducts];

                renderProductsGrid(reorderedProducts, matched.id);
                document.getElementById("product-grid")?.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            appendMessage("ai", "Bhai response lene mein koi issue aya hai.");
        }
    } catch (err) {
        console.error("Chat Error:", err);
        appendMessage("ai", "Bhai network problem ki waja se connection nahi ban paya.");
    }
}

// Helper: Append Text Messages
function appendMessage(sender, text) {
    const chatContainer = document.getElementById("chat-messages");
    if (!chatContainer) return;

    const msgDiv = document.createElement("div");
    msgDiv.style.margin = "8px 0";
    msgDiv.style.textAlign = sender === "user" ? "right" : "left";

    const bubble = document.createElement("span");
    bubble.style.cssText = `
        display: inline-block;
        padding: 8px 12px;
        border-radius: 12px;
        max-width: 80%;
        font-size: 13px;
        background: ${sender === "user" ? "#007bff" : "#e9ecef"};
        color: ${sender === "user" ? "#fff" : "#333"};
    `;
    bubble.innerText = text;

    msgDiv.appendChild(bubble);
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Helper: Append Interactive Product Card inside Chat Widget
function appendChatProductCard(product) {
    const chatContainer = document.getElementById("chat-messages");
    if (!chatContainer) return;

    const cardDiv = document.createElement("div");
    cardDiv.style.cssText = `
        background: #f8f9fa;
        border: 1px solid #007bff;
        border-radius: 8px;
        padding: 10px;
        margin: 8px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    cardDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; border-radius: 4px;">
        <div style="flex-grow: 1;">
            <h4 style="margin: 0; font-size: 13px;">${product.name}</h4>
            <span style="color: #28a745; font-weight: bold; font-size: 12px;">$${product.price}</span>
        </div>
        <button onclick="addToCart(${product.id})" style="background: #007bff; color: white; border: none; padding: 4px 8px; font-size: 11px; border-radius: 4px; cursor: pointer;">Add</button>
    `;

    chatContainer.appendChild(cardDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ======================================================
// 🛒 CART MANAGEMENT & CHECKOUT SYSTEM
// ======================================================

function initCartUI() {
    // Create Cart Floating Button if not exists
    if (!document.getElementById("cart-float-btn")) {
        const cartBtn = document.createElement("button");
        cartBtn.id = "cart-float-btn";
        cartBtn.innerHTML = "🛒 Cart (<span id='cart-count'>0</span>)";
        cartBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        cartBtn.onclick = toggleCartDrawer;
        document.body.appendChild(cartBtn);
    }

    // Create Cart Drawer Container if not exists
    if (!document.getElementById("cart-drawer")) {
        const drawer = document.createElement("div");
        drawer.id = "cart-drawer";
        drawer.style.cssText = `
            position: fixed;
            top: 0;
            right: -350px;
            width: 330px;
            height: 100%;
            background: #fff;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            z-index: 1100;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
            padding: 20px;
            box-sizing: border-box;
        `;

        drawer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                <h2 style="margin: 0; font-size: 18px;">Your Shopping Cart</h2>
                <button onclick="toggleCartDrawer()" style="background: none; border: none; font-size: 18px; cursor: pointer;">✕</button>
            </div>
            <div id="cart-items-container" style="flex-grow: 1; overflow-y: auto; margin: 15px 0;">
                <p style="color: #777; text-align: center;">Cart is empty!</p>
            </div>
            <div style="border-top: 1px solid #ddd; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: bold; font-size: 16px;">
                    <span>Total:</span>
                    <span id="cart-total" style="color: #28a745;">$0.00</span>
                </div>
                <button onclick="checkout()" style="width: 100%; background: #007bff; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">Proceed to Checkout</button>
            </div>
        `;
        document.body.appendChild(drawer);
    }
}

function toggleCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) {
        const currentRight = drawer.style.right;
        drawer.style.right = currentRight === "0px" ? "-350px" : "0px";
    }
}

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    
    // Open drawer automatically on add
    const drawer = document.getElementById("cart-drawer");
    if (drawer) drawer.style.right = "0px";
}

function updateCartUI() {
    const countSpan = document.getElementById("cart-count");
    const container = document.getElementById("cart-items-container");
    const totalSpan = document.getElementById("cart-total");

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countSpan) countSpan.innerText = totalCount;

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="color: #777; text-align: center;">Cart is empty!</p>';
        if (totalSpan) totalSpan.innerText = "$0.00";
        return;
    }

    container.innerHTML = "";
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        const itemDiv = document.createElement("div");
        itemDiv.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            border-bottom: 1px solid #f1f1f1;
            padding-bottom: 8px;
        `;

        itemDiv.innerHTML = `
            <div>
                <h5 style="margin: 0; font-size: 13px;">${item.name}</h5>
                <span style="color: #666; font-size: 12px;">$${item.price} x ${item.quantity}</span>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: #dc3545; color: white; border: none; padding: 3px 6px; border-radius: 4px; font-size: 10px; cursor: pointer;">Remove</button>
        `;
        container.appendChild(itemDiv);
    });

    if (totalSpan) totalSpan.innerText = "$" + totalPrice.toFixed(2);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function checkout() {
    if (cart.length === 0) {
        alert("Bhai cart khali hai, pehle kuch add karo!");
        return;
    }
    alert("🎉 Mubarak ho! Aapka order successfully place ho gaya hai!");
    cart = [];
    updateCartUI();
    toggleCartDrawer();
}