const token = localStorage.getItem("token");

loadDashboard();

async function loadDashboard() {

    const res = await fetch(

        "http://localhost:3000/api/farmer-dashboard",

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    const data = await res.json();

    document.getElementById("products").textContent =
        data.productsUploaded;

    document.getElementById("orders").textContent =
        data.ordersReceived;

    document.getElementById("revenue").textContent =
        "₦" + data.revenue.toLocaleString();

    const table = document.getElementById("ordersTable");

    table.innerHTML = "";

    data.orders.forEach(order => {

        table.innerHTML += `

<tr>

<td>${order.buyer.fullname}</td>

<td>${order.buyer.phone}</td>

<td>${order.delivery.whatsapp}</td>

<td>${order.delivery.address}, ${order.delivery.state}</td>

<td>${order.product}</td>

<td>${order.quantity}</td>

<td>₦${order.farmerPrice.toLocaleString()}</td>

<td>₦${order.commission.toLocaleString()}</td>

<td>₦${order.transport.toLocaleString()}</td>

<td>₦${order.buyerPaid.toLocaleString()}</td>

<td>

<select onchange="updateStatus('${order.orderId}',this.value)">

<option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>

<option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Processing</option>

<option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>

<option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>

<option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>

</select>

</td>

</tr>

`;

    });

}
async function updateStatus(id, status) {

    const res = await fetch(

        `http://localhost:3000/api/farmer-dashboard/${id}/status`,

        {

            method: "PATCH",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                status

            })

        }

    );

    const data = await res.json();

    alert(data.message);

    loadDashboard();

}