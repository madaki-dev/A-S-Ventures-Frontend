const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log("PRODUCT ID:", productId);

async function getProduct() {

    try {

        if (!productId) {
            console.error("No product ID in URL");
            return;
        }

        const res = await fetch(
            `https://a-s-ventures-backend.onrender.com/api/products/${productId}`
        );

        console.log("STATUS:", res.status);

        const product = await res.json();

        console.log("PRODUCT:", product);

        if (!res.ok) {
            throw new Error(product.message);
        }

        const container = document.getElementById("productGrid");

        if (!container) {
            console.error("productGrid not found");
            return;
        }

        container.innerHTML = `
        
            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.productName}"
                >

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h1>
                    ${product.productName}
                </h1>

                <h2>
                    ₦${Number(product.sellingPrice).toLocaleString()}
                </h2>

                <p>
                    📍 ${product.location}
                </p>

                <p>
                    ${product.description}
                </p>


                <div class="product-meta">

                    <div>
                        <strong>
                            Available Quantity
                        </strong>

                        <p>
                            ${product.stock}
                        </p>
                    </div>


                    <div>
                        <strong>
                            Supplier
                        </strong>

                        <p>
                            ${product.farmer?.fullName || "Unknown"}
                        </p>
                    </div>

                </div>


                <div class="product-actions">

                    <a href="orders.html?id=${product._id}">
                        <button class="primary-btn">
                            Place Order
                        </button>
                    </a>

                    <a href="marketplace.html">
                        <button class="secondary-btn">
                            Back To Marketplace
                        </button>
                    </a>

                </div>

            </div>

        `;

        console.log("Product successfully displayed!");

    } catch (error) {

        console.error(
            "ERROR LOADING PRODUCT:",
            error
        );

    }
}

getProduct();