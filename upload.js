const token = localStorage.getItem("token");

const form = document.querySelector(".upload-card form");

const productName = document.getElementById("productName");
const category = document.getElementById("category");
const quantity = document.getElementById("quantity");
const price = document.getElementById("price");
const locationInput = document.getElementById("location");
const description = document.getElementById("description");
const image = document.getElementById("image");


if (!token) {

    alert("Please login first.");

    window.location.href = "login.html";

}


form.addEventListener("submit", async (e) => {

    e.preventDefault();


    if (!image.files[0]) {

        alert("Please select a product image.");

        return;
    }


    const formData = new FormData();

    formData.append(
        "productName",
        productName.value.trim()
    );

    formData.append(
        "category",
        category.value
    );

    formData.append(
        "quantity",
        quantity.value
    );

    formData.append(
        "price",
        price.value
    );

    formData.append(
        "location",
        locationInput.value.trim()
    );

    formData.append(
        "description",
        description.value.trim()
    );

    formData.append(
        "image",
        image.files[0]
    );


    try {

        const res = await fetch(
            "https://a-s-ventures-backend.onrender.com/api/products",
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                },

                body: formData
            }
        );


        const data =
            await res.json();


        if (res.status === 401 || res.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert(
                "Your login session has expired. Please login again."
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!res.ok) {

            alert(
                data.message ||
                "Failed to upload product."
            );

            return;
        }


        alert(
            data.message ||
            "Product uploaded successfully!"
        );

        form.reset();


    } catch (error) {

        console.error(
            "Upload error:",
            error
        );

        alert(
            "Something went wrong while uploading."
        );
    }

});