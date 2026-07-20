const params = new URLSearchParams(window.location.search);

const transactionId = params.get("transaction_id");

const token = localStorage.getItem("token");

async function verify() {

    const res = await fetch(

        `https://a-s-ventures-backend.onrender.com/api/payment/verify/${transactionId}`,
        {
            headers: {

                Authorization: `Bearer ${token}`

            }
        }
    );

    const data = await res.json();

    console.log(data);

}

verify();

window.location.href = "orders.html";