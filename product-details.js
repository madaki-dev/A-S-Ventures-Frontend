const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log("PRODUCT ID:", productId);


// ==========================================
// LOAD PRODUCT
// ==========================================

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

            throw new Error(
                product.message ||
                "Failed to load product."
            );

        }


        const container =
            document.getElementById("productGrid");


        if (!container) {

            console.error(
                "productGrid not found"
            );

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
                    ₦${Number(
            product.sellingPrice
        ).toLocaleString()}
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

                        <p class="unit">
                            ${product.stock}
                        </p>

                    </div>


                    <div>

                        <strong>
                            Supplier
                        </strong>

                        <p class="unit">
                            ${product.farmer?.fullName ||
            "Unknown"
            }
                        </p>

                    </div>

                </div>


               <div class="product-actions">

    <button
        type="button"
        class="primary-btn"
        onclick="placeOrder('${product._id}')">
        Place Order
    </button>

    <a href="marketplace.html">
        <button
            type="button"
            class="secondary-btn">
            Back To Marketplace
        </button>
    </a>

</div>
            </div>

        `;


        // ==========================================
        // PLACE ORDER BUTTON
        // ==========================================

        document
            .getElementById("placeOrderBtn")
            .addEventListener(
                "click",
                () => {

                    placeOrder(product);

                }
            );


        console.log(
            "Product successfully displayed!"
        );


    } catch (error) {

        console.error(
            "ERROR LOADING PRODUCT:",
            error
        );

    }

}


// ==========================================
// ADD PRODUCT TO CART + GO TO ORDER
// ==========================================

function placeOrder(product) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please login before placing an order."
        );

        window.location.href =
            "login.html";

        return;

    }


    // ==========================================
    // GET EXISTING CART
    // ==========================================

    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

    } catch (error) {

        console.error(
            "CART PARSE ERROR:",
            error
        );

        cart = [];

    }


    // ==========================================
    // CHECK WHETHER PRODUCT IS ALREADY IN CART
    // ==========================================

    const existingProduct =
        cart.find(
            item =>
                item._id === product._id ||
                item.id === product._id
        );


    if (!existingProduct) {

        cart.push({

            ...product,

            quantity: 1

        });

    } else {

        existingProduct.quantity =
            existingProduct.quantity || 1;

    }


    // ==========================================
    // SAVE CART
    // ==========================================

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    console.log(
        "CART UPDATED:",
        cart
    );


    // ==========================================
    // GO TO ORDER PAGE
    // ==========================================

    window.location.href =
        `orders.html?id=${product._id}`;

}


// ==========================================
// START
// ==========================================

getProduct();

// ==============================
// PLACE ORDER
// ==============================

async function placeOrder(productId) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        alert(
            "Please login before placing an order."
        );

        window.location.href =
            "login.html";

        return;
    }

    try {

        const res =
            await fetch(
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
                        productId: productId,
                        quantity: 1
                    })
                }
            );

        const data =
            await res.json();

        console.log(
            "PLACE ORDER CART RESPONSE:",
            data
        );

        if (!res.ok) {

            alert(
                data.message ||
                "Could not add product."
            );

            return;
        }

        // Send buyer to the existing checkout
        window.location.href =
            "buyer-checkoutForm.html";

    } catch (error) {

        console.error(
            "PLACE ORDER ERROR:",
            error
        );

        alert(
            "Something went wrong while preparing your order."
        );

    }

}