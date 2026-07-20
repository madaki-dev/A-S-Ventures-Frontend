const token = localStorage.getItem("token");

const res = await fetch("https://a-s-ventures-backend.onrender.com/api/cart", {

    headers: {

        Authorization: `Bearer ${token}`

    }
});

const cart = await res.json();

const container = document.getElementById("cart");

container.innerHTML = "";

cart.forEach(item => {

    container.innerHTML += `
    
    <div>

    <img src="/uploads/${item.product.image}" width="150">

    <h2>${item.product.productName}</h2>

    <p>N${item.product.price}</p>

    <p>Qty:${item.quantity}</p>

    <button onclick="removeItem('${item._id}')">

    Remove

    </button>

    <button onclick="checkout()">

    Proceed To Payment

    </button>

    </div>

    `;
});

//Remove Item

async function removeItem(id) {

    const token = localStorage.getItem("token");

    await fetch(`https://a-s-ventures-backend.onrender.com/api/cart/${id}`, {

        method: "DELETE",

        headers: {

            Authorization: `Bearer ${token}`

        }
    });

    location.reload();

}

async function checkout() {

    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user"));

    const amount = calculateTotal();

    const res = await fetch("https://a-s-ventures-backend.onrender.com/api/payment/initialize", {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`

        },

        body: JSON.stringify({

            amount,

            email: user.email

        })
    });

    const data = await res.json();

    window.location.href = data.paymentLink;

}