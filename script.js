console.log("loaded");
const farmerForm =
    document.getElementById("farmerForm");

const password = document.getElementById("password");

const confirmPassword = document.getElementById("confirmPassword");

const showPassword = document.getElementById("showPassword");

showPassword.addEventListener("change", () => {
    const type = showPassword.checked ? "text" : "password";

    password.type = type;
    confirmPassword.type = type;
});

farmerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const passwordInput = password.value;

    const confirmPasswordInput = confirmPassword.value;

    if (passwordInput !== confirmPasswordInput) {
        alert("Passwords do not match.");
        return;
    }

    // Grab input fields
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phoneNumber").value;
    const accountType = document.getElementById("accountType").value;

    //Signup Request
    const user = {
        fullName: fullName,
        email: email,
        password: password.value,
        confirmPassword: confirmPassword.value,
        phone: phone,
        accountType: accountType,
    };

    const res = await fetch("https://a-s-ventures-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    let data;
    try {
        data = await res.json();
    } catch {
        alert("Server did not return JSON. Check backend logs.");
        return;
    }


    if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert(
            "Account Creation Successful!"
        );

        window.location.href =
            "Profile.html";
    } else {
        alert(data.message);
    }
});
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("https://a-s-ventures-backend.onrender.com/api/admin", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const user = await res.json();

        if (user.role === "Admin") {
            const nav = document.getElementById("nav-links");
            nav.innerHTML += `<li><a href="/admin-dashboard.html">Admin Dashboard</a></li>`;
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
});
