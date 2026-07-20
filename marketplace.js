const products = [
    {
        name: "Maize",
        category: "Grains",
        price: "₦350,000/Ton",
        location: "Niger State",
        image: "https://picsum.photos/300/200?1"
    },
    {
        name: "Rice",
        category: "Grains",
        price: "₦420,000/Ton",
        location: "Kebbi State",
        image: "https://picsum.photos/300/200?2"
    },
    {
        name: "Soybeans",
        category: "Legumes",
        price: "₦390,000/Ton",
        location: "Benue State",
        image: "https://picsum.photos/300/200?3"
    },
    {
        name: "Yam",
        category: "Tubers",
        price: "₦280,000/Ton",
        location: "Kogi State",
        image: "https://picsum.photos/300/200?4"
    }
];

async function addToCart(productId) {

    const token = localStorage.getItem("token");

    const res = await fetch("/api/cart", {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`

        },

        body: JSON.stringify({

            productId,

            quantity: 1

        })
    });

    const data = await res.json();

    alert(data.message);

}

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(value)
        );

        renderProducts(filtered);

    });

}
document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const res = await fetch("/api/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();

    console.log(data);

});

async function getProducts() {

    const res = await fetch("/api/products");

    const products = await res.json();

    const container = document.getElementById("productGrid")

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
            <div class="product-card">

                <img src="/uploads/${product.image}" alt="${product.name}">

                    <h3>${product.name}</h3>

                    <p>${product.location}</p>

                    <h4>${product.sellingPrice}</h4>

                    <p>${product.stock}</p>

                    <button onclick="buy('${product._id}')" class="primary-btn">

                    Buy Now

                    </button>

                    <button onclick="addToCart('${product._id}')">

                    Add To Cart

                    </button>

                </div>

        `;

    });

}