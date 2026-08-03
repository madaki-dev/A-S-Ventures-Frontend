let currentPage = 1;
let totalPages = 1;

let allProducts = [];


// ==============================
// RENDER PRODUCTS
// ==============================

function renderProducts(products) {

    const container =
        document.getElementById("productGrid");

    container.innerHTML = "";

    if (!products || products.length === 0) {

        container.innerHTML =
            "<p>No products found.</p>";

        return;
    }

    products.forEach(product => {

        const imgSrc =
            product.image.startsWith("http")
                ? product.image
                : "https://a-s-ventures-backend.onrender.com/uploads/" + product.image;


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
                    ₦${Number(product.sellingPrice).toLocaleString()}/bag
                </h4>

                <p>
                    Quantity: ${product.quantity}
                </p>

               <div class="product-actions">

    <button
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
            `https://a-s-ventures-backend.onrender.com/api/products?page=${page}`
        );

        if (!res.ok) {

            const error =
                await res.json();

            throw new Error(
                error.message
            );
        }


        // IMPORTANT:
        // Backend still returns an ARRAY

        const products =
            await res.json();


        allProducts = products;

        currentPage = page;


        // Read pagination information
        // from backend headers

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

    }

}



// ==============================
// PAGINATION DISPLAY
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


    if (!pageNumber) return;


    pageNumber.textContent =
        `Page ${currentPage} of ${totalPages}`;


    prevButton.disabled =
        currentPage <= 1;


    nextButton.disabled =
        currentPage >= totalPages;

}



// ==============================
// NEXT BUTTON
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
// PREVIOUS BUTTON
// ==============================

document
    .getElementById("prevPage")
    ?.addEventListener(
        "click",
        () => {

            if (
                currentPage > 1
            ) {

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
                    .toLowerCase();


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
        localStorage.getItem(
            "token"
        );


    const res = await fetch(
        "https://a-s-ventures-backend.onrender.com/api/cart",
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


    if (res.ok) {

        alert(data.message);

        window.location.href =
            "Cart.html";

    } else {

        alert(
            "Error: " +
            data.message
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