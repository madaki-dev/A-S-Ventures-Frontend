// Global product list
let allProducts = [];

// Render function
function renderProducts(products) {
    const container = document.getElementById("productGrid");
    container.innerHTML = "";
    products.forEach(product => {
        const imgSrc = product.image.startsWith("http")
            ? product.image
            : "/uploads/" + product.image;

        container.innerHTML += `
      <div class="product-card">
        <img src="${imgSrc}" alt="${product.productName}">
        <h3>${product.productName}</h3>
        <p>${product.location}</p>
        <h4>₦${product.sellingPrice}/Ton</h4>
        <p>Quantity: ${product.quantity}</p>
        <button onclick="addToCart('${product._id}')">Add To Cart</button>
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
        window.location.href = "Cart.html";
    } else {
        alert("Error: " + data.message);
    }
}

// Search
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        const filtered = allProducts.filter(product =>
            product.productName.toLowerCase().includes(value)
        );
        renderProducts(filtered);
    });
}

// On page load
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("https://a-s-ventures-backend.onrender.com/api/products", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const backendProducts = await res.json();
        allProducts = backendProducts;
        renderProducts(allProducts);
    } catch (error) {
        console.error("Error loading backend products:", error);
        renderProducts([]);
    }
});
