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

async function updateStatus(id, status) {

    const token = localStorage.getItem("token");

    const res = await fetch(`/api/orders/${id}/status`, {

        method: "PATCH",

        headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`

        },

        body: JSON.stringify({
            status
        })
    });

    const data = await res.json();

    alert(data.message);

}