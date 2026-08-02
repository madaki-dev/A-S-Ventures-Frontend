document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        // Fetch farmer profile
        const res = await fetch("https://a-s-ventures-backend.onrender.com/api/profile", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const user = await res.json();

        // Fetch farmer products
        const prodRes = await fetch("https://a-s-ventures-backend.onrender.com/api/products/mine", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const products = await prodRes.json();

        // Fetch farmer orders
        const orderRes = await fetch("https://a-s-ventures-backend.onrender.com/api/orders/mine", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const orders = await orderRes.json();

        // Update stats
        document.querySelector(".dashboard-stats .stat-card:nth-child(1) h2").innerText = products.length;
        document.querySelector(".dashboard-stats .stat-card:nth-child(2) h2").innerText = orders.length;
        document.querySelector(".dashboard-stats .stat-card:nth-child(3) h2").innerText =
            "₦" + orders.reduce((sum, o) => sum + o.totalPrice, 0);

        // Render products with delete button
        const grid = document.querySelector(".product-grid");
        grid.innerHTML = "";
        products.forEach(p => {
            grid.innerHTML += `
        <div class="product-card">
          <img src="${p.image}" />
          <h3>${p.productName}</h3>
          <p>${p.location}</p>
          <h4>₦${p.sellingPrice}/Ton</h4>
          <button onclick="deleteProduct('${p._id}')">Delete</button>
        </div>
      `;
        });
    } catch (err) {
        console.error("Error loading dashboard:", err);
    }
});

async function deleteProduct(id) {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`https://a-s-ventures-backend.onrender.com/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
        // Reload dashboard after deletion
        window.location.reload();
    }
}
