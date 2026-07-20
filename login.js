//Login Request
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("https://a-s-ventures-backend.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("accountType", data.accountType);

            if (data.accountType === "buyer") {
                window.location.href = "marketplace.html";
            } else if (data.accountType === "farmer") {
                window.location.href = "farmer-dashboard.html";
            } else {
                alert(data.message);
            }
        }
    } catch (error) {
        console.log(error);
        alert("Unable to connect to server.");
    }
})