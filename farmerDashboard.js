document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        const res = await fetch(
            "https://a-s-ventures-backend.onrender.com/api/farmer-dashboard",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Could not load dashboard");
        }

        console.log("Dashboard data:", data);

        // ==========================
        // UPDATE STATS
        // ==========================

        document.querySelector(
            ".dashboard-stats .stat-card:nth-child(1) h2"
        ).innerText = data.productsUploaded;

        document.querySelector(
            ".dashboard-stats .stat-card:nth-child(2) h2"
        ).innerText = data.ordersReceived;

        document.querySelector(
            ".dashboard-stats .stat-card:nth-child(3) h2"
        ).innerText =
            "₦" + Number(data.revenue).toLocaleString();


        // ==========================
        // DISPLAY PRODUCTS
        // ==========================

        const grid =
            document.querySelector(".product-grid");

        grid.innerHTML = "";

        if (!data.products || data.products.length === 0) {

            grid.innerHTML = `
    <div class="no-products-card">

        <div class="no-products-icon">
            📦
        </div>

        <h2>No Products Listed Yet</h2>

        <p>
            You haven't added any products to the marketplace.
        </p>

        <a href="upload-product.html" class="add-product-btn">
            + Add New Product
        </a>

    </div>
`;

            return;
        }


        data.products.forEach(product => {

            const image =
                product.image?.startsWith("http")
                    ? product.image
                    : `https://a-s-ventures-backend.onrender.com/uploads/${product.image}`;

            grid.innerHTML += `

                <div class="product-card">

                    <img
                        src="${image}"
                        alt="${product.productName}"
                    >

                    <h3>
                        ${product.productName}
                    </h3>

                    <p>
                        ${product.location}
                    </p>

                    <h4>
                        ₦${Number(
                product.sellingPrice
            ).toLocaleString()}
                    </h4>

                    <p>
                        Quantity: ${product.quantity}
                    </p>

                    <button
                        onclick="deleteProduct('${product._id}')">
                        Delete
                    </button>

                </div>

            `;
        });

    } catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );

    }

});