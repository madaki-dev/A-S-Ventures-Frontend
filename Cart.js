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

    <img
    src="https://a-s-ventures-backend.onrender.com/uploads/${item.product.image}"
    width="150"
>

    <h2>${item.product.productName}</h2>

    <p>N${item.product.sellingPrice}</p>

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

function checkout() {

    window.location.href =
        "buyer-checkout.html";

}