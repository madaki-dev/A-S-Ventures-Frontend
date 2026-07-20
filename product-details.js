const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

async function getProducts() {

    const res = await fetch(`/api/products/${productId}`);

    const product = await res.json();

    const container = document.getElementById("productGrid")

    container.innerHTML = "";

    product.forEach(product => {

        container.innerHTML += `
            <div class="product-image">
                <img src="/uploads/${product.image}" alt="Product" />
            </div>

            <div class="product-info">
                <span class="product-category">${product.category}</span>

                <h1>${product.productName}</h1>

                <h2>${product.sellingPrice}/${product.quantity}</h2>

                <p>📍${product.location}</p>

                <p>
                    ${product.description}
                </p>

            <div class="product-meta">
                <div>
                    <strong>Available Quantity</strong>
                    <p>${product.stock}</p>
                </div>

            <div>
                <strong>Supplier</strong>
                <p>${product.farmer.fullName}</p>
            </div>
            </div>
            </div>
      `;
    });
}
