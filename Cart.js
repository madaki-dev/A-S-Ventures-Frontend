const API =
    "https://a-s-ventures-backend.onrender.com";

// ==============================
// LOAD CART
// ==============================

async function loadCart() {

    const container =
        document.getElementById("cart");

    if (!container) return;

    const token =
        localStorage.getItem("token");

    if (!token) {

        window.location.href =
            "login.html";

        return;
    }

    try {

        const res = await fetch(
            `${API}/api/cart`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        const data =
            await res.json();

        console.log(
            "Cart response:",
            data
        );

        if (!res.ok) {

            console.error(
                "Cart request failed:",
                data
            );

            alert(
                data.message ||
                "Could not load cart."
            );

            return;
        }

        const cart = data;

        container.innerHTML = "";

        if (
            !Array.isArray(cart) ||
            cart.length === 0
        ) {

            container.innerHTML = `
                <div class="order-card">

                    <h2>Your cart is empty.</h2>

                    <p>
                        Add products from the marketplace.
                    </p>

                    <a href="marketplace.html" class="marketplace-link">
                        Go To Marketplace
                    </a>

                </div>
            `;

            return;
        }


        // ==============================
        // DISPLAY CART ITEMS
        // ==============================

        cart.forEach(item => {

            if (!item.product) {

                console.warn(
                    "Cart item has no product:",
                    item
                );

                return;
            }

            const product =
                item.product;

            const image =
                product.image?.startsWith("http")
                    ? product.image
                    : `${API}/uploads/${product.image}`;

            const subtotal =
                Number(product.sellingPrice) *
                Number(item.quantity);


            container.innerHTML += `

                <div class="order-card">

                    <img
                        src="${image}"
                        width="150"
                        alt="${product.productName}"
                    >

                    <h2>
                        ${product.productName}
                    </h2>

                    <p>
                        Price:
                        ₦${Number(
                product.sellingPrice
            ).toLocaleString()}
                    </p>

                    <p>
                        Quantity:
                        ${item.quantity}
                    </p>

                    <p>
                        Subtotal:
                        ₦${subtotal.toLocaleString()}
                    </p>

                    <button
                        type="button"
                        onclick="removeItem('${item._id}')">
                        Remove
                    </button>

                </div>

            `;

        });


        // Checkout button

        container.innerHTML += `

            <div class="order-card">

                <button
                    type="button"
                    onclick="checkout()">
                    Proceed To Checkout
                </button>

            </div>

        `;

    } catch (error) {

        console.error(
            "LOAD CART ERROR:",
            error
        );

        container.innerHTML = `
            <p>
                Something went wrong while
                loading your cart.
            </p>
        `;
    }
}


// ==============================
// REMOVE ITEM
// ==============================

async function removeItem(id) {

    const token =
        localStorage.getItem("token");

    try {

        const res = await fetch(
            `${API}/api/cart/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        const data =
            await res.json();

        if (!res.ok) {

            alert(
                data.message ||
                "Could not remove item."
            );

            return;
        }

        loadCart();

    } catch (error) {

        console.error(
            "REMOVE ITEM ERROR:",
            error
        );

        alert(
            "Something went wrong."
        );
    }
}


// ==============================
// CHECKOUT
// ==============================

function checkout() {

    window.location.href =
        "buyer-checkoutForm.html";
}


// ==============================
// PAGE LOAD
// ==============================

document.addEventListener(
    "DOMContentLoaded",
    loadCart
);