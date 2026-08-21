//Login Request
const loginForm = document.getElementById("loginForm");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");


togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.src = "eye-off.png";
        togglePassword.alt = "Hide password";

    } else {

        passwordInput.type = "password";

        togglePassword.src = "eye.png";
        togglePassword.alt = "Show password";

    }

});

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
            window.location.href = "Profile.html";
        }
    } catch (error) {
        console.log(error);
        alert("Unable to connect to server.");
    }
})