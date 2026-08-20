let currentPage = 1;
let totalPages = 1;
let allProducts = [];

const API =
    "https://a-s-ventures-backend.onrender.com";

// ==============================
// RENDER PRODUCTS
// ==============================

function renderProducts(products) {

    const container =
        document.getElementById("productGrid");

    if (!container) return;

    container.innerHTML = "";

    if (!products || products.length === 0) {

        container.innerHTML =
            "<p>No products found.</p>";

        return;
    }

    products.forEach(product => {

        const imgSrc =
            product.image;

        container.innerHTML += `

            <div class="product-card">

                <img
                    src="${imgSrc}"
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
        ).toLocaleString()}/bag
                </h4>

                <p>
                    Quantity: ${product.quantity}
                </p>

                <div class="product-actions">

                    <button
                        type="button"
                        onclick="addToCart('${product._id}')"
                        class="cart-btn">
                        Add To Cart
                    </button>

                    <a
                        href="product-details.html?id=${product._id}"
                        class="details-btn">
                        See Details
                    </a>

                </div>

            </div>

        `;

    });
}


// ==============================
// GET PRODUCTS
// ==============================

async function getProducts(page = 1) {

    try {

        const res = await fetch(
            `${API}/api/products?page=${page}`
        );

        if (!res.ok) {

            const error =
                await res.json();

            throw new Error(
                error.message ||
                "Failed to load products."
            );
        }

        const products =
            await res.json();

        allProducts = products;

        currentPage = page;

        totalPages =
            Number(
                res.headers.get(
                    "X-Total-Pages"
                )
            ) || 1;

        renderProducts(
            allProducts
        );

        updatePagination();

    } catch (error) {

        console.error(
            "PRODUCT ERROR:",
            error
        );

        const container =
            document.getElementById(
                "productGrid"
            );

        if (container) {

            container.innerHTML =
                `<p>Unable to load products.</p>`;
        }
    }
}


// ==============================
// PAGINATION
// ==============================

function updatePagination() {

    const pageNumber =
        document.getElementById(
            "pageNumber"
        );

    const prevButton =
        document.getElementById(
            "prevPage"
        );

    const nextButton =
        document.getElementById(
            "nextPage"
        );

    if (pageNumber) {

        pageNumber.textContent =
            `Page ${currentPage} of ${totalPages}`;
    }

    if (prevButton) {

        prevButton.disabled =
            currentPage <= 1;
    }

    if (nextButton) {

        nextButton.disabled =
            currentPage >= totalPages;
    }
}


// ==============================
// NEXT PAGE
// ==============================

document
    .getElementById("nextPage")
    ?.addEventListener(
        "click",
        () => {

            if (
                currentPage <
                totalPages
            ) {

                getProducts(
                    currentPage + 1
                );
            }
        }
    );


// ==============================
// PREVIOUS PAGE
// ==============================

document
    .getElementById("prevPage")
    ?.addEventListener(
        "click",
        () => {

            if (currentPage > 1) {

                getProducts(
                    currentPage - 1
                );
            }
        }
    );


// ==============================
// SEARCH
// ==============================

const searchInput =
    document.getElementById(
        "searchInput"
    );

if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        function () {

            const value =
                this.value
                    .toLowerCase()
                    .trim();

            const filtered =
                allProducts.filter(
                    product =>
                        product.productName
                            .toLowerCase()
                            .includes(value)
                );

            renderProducts(
                filtered
            );
        }
    );
}


// ==============================
// ADD TO CART
// ==============================

async function addToCart(productId) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        alert(
            "Please login before adding products to your cart."
        );

        window.location.href =
            "login.html";

        return;
    }

    try {

        const res =
            await fetch(
                `${API}/api/cart`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        productId,
                        quantity: 1
                    })
                }
            );

        const data =
            await res.json();

        console.log(
            "Add to cart response:",
            data
        );

        if (!res.ok) {

            if (
                res.status === 401 ||
                res.status === 403
            ) {

                alert(
                    data.message ||
                    "Please login as a buyer."
                );

                return;
            }

            alert(
                data.message ||
                "Could not add product to cart."
            );

            return;
        }

        alert(
            data.message ||
            "Product added to cart."
        );

    } catch (error) {

        console.error(
            "ADD TO CART ERROR:",
            error
        );

        alert(
            "Something went wrong while adding the product to your cart."
        );
    }
}


// ==============================
// PAGE LOAD
// ==============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {

            window.location.href =
                "login.html";

            return;
        }

        getProducts(1);
    }
);