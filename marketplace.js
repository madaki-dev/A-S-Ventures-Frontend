// Demo products
const demoProducts = [
    { name: "Maize", category: "Grains", price: "₦350,000/Ton", location: "Niger State", image: "https://images.unsplash.com/photo-1634666328718-ad6af3112aff?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Rice", category: "Grains", price: "₦420,000/Ton", location: "Kebbi State", image: "https://plus.unsplash.com/premium_photo-1705516190542-8b3376798ea4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Soybeans", category: "Legumes", price: "₦390,000/Ton", location: "Benue State", image: "https://images.unsplash.com/photo-1639843606783-b2f9c50a7468?q=80&w=773&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Yam", category: "Tubers", price: "₦280,000/Ton", location: "Kogi State", image: "https://images.unsplash.com/photo-1783553642630-792e38bf992a?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];

// Global product list
let allProducts = [...demoProducts];

// Render function
function renderProducts(products) {
    const container = document.getElementById("productGrid");
    container.innerHTML = "";
    products.forEach(product => {
        container.innerHTML += `
      <div class="product-card">
        <img src="${product.image.startsWith('http') ? product.image : '/uploads/' + product.image}" alt="${product.name || product.productName}">
        <h3>${product.name || product.productName}</h3>
        <p>${product.location}</p>
        <h4>${product.price || product.sellingPrice}</h4>
        <p>${product.stock ? "Stock: " + product.stock : ""}</p>
        <button onclick="addToCart('${product._id || ''}')">Add To Cart</button>
      </div>
    `;
    });
}

// Add to cart
async function addToCart(productId) {
    const token = localStorage.getItem("token");
    const res = await fetch("https://a-s-ventures-backend.onrender.com/api/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
    });
    const data = await res.json();
    if (res.ok) {
        alert(data.message);
        // ✅ Redirect to cart page
        window.location.href = "Cart.html";
    } else {
        alert("Error: " + data.message);
    }
    alert(data.message);
}

// Search
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        const filtered = allProducts.filter(product =>
            (product.name || product.productName).toLowerCase().includes(value)
        );
        renderProducts(filtered);
    });
}

// On page load
document.addEventListener("DOMContentLoaded", async () => {
    // Show demo immediately
    renderProducts(allProducts);

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        // Fetch backend products
        const res = await fetch("https://a-s-ventures-backend.onrender.com/api/products");
        const backendProducts = await res.json();

        // Merge demo + backend
        allProducts = [...demoProducts, ...backendProducts];
        renderProducts(allProducts);
    } catch (error) {
        console.error("Error loading backend products:", error);
        // fallback: demo only
        allProducts = [...demoProducts];
        renderProducts(allProducts);
    }
});
