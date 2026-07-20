const token = localStorage.getItem("token");

async function loadOrders() {

    const res = await fetch("/api/orders/my-orders", {

        headers: {

            Authorization: `Bearer ${token}`

        }
    });

    const orders = await res.json();

    const container = document.getElementById("orders");

    container.innerHTML = "";

    orders.forEach(order => {

        container.innerHTML += `
        <div class="order-card">
           <h3>Order ID: ${order._id}</h3>
           <p>Total: ₦${order.totalAmount}</p>
           <p>Status: ${order.status}</p>
           <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
           <hr>
        </div>
        `;
    });
}

loadOrders();