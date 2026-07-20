const token = localStorage.getItem("token");

const product = document.getElementById("product");
const category = document.getElementById("category");
const quantity = document.getElementById("quantity");
const unit = document.getElementById("unit");
const price = document.getElementById("price");
const locationInput = document.getElementById("location");
const description = document.getElementById("description");
const image = document.getElementById("image");

const formData = new FormData();

formData.append("productName", product.value);
formData.append("category", category.value);
formData.append("quantity", quantity.value);
formData.append("unit", unit.value);
formData.append("price", price.value);
formData.append("location", locationInput.value);
formData.append("description", description.value);
formData.append("image", image.files[0]);

const res = await fetch("https://a-s-ventures-backend.onrender.com/api/products", {

    method: "POST",

    headers: {

        Authorization: `Bearer ${token}`

    },

    body: formData

});

const data = await res.json();

alert(data.message);