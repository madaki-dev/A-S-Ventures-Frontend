const token = localStorage.getItem("token");

loadDashboard();

loadOrders();

async function loadDashboard() {

    const res = await fetch(

        "http://localhost:3000/api/admin/dashboard",

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    const data = await res.json();

    document.getElementById("sales").textContent =

        "₦" + data.totalSales.toLocaleString();

    document.getElementById("orders").textContent =

        data.totalOrders;

    document.getElementById("commission").textContent =

        "₦" + data.commissionEarned.toLocaleString();

}

async function loadOrders() {

    const res = await fetch(

        "/api/admin/orders",

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    const orders = await res.json();

    const table = document.getElementById("ordersTable");

    table.innerHTML = "";

    orders.forEach(order => {

        order.products.forEach(product => {

            table.innerHTML += `

<tr>

<td>${order.buyer.fullname}</td>

<td>${product.farmer}</td>

<td>${product.product}</td>

<td>${product.quantity}</td>

<td>₦${product.farmerPrice.toLocaleString()}</td>

<td>₦${product.commission.toLocaleString()}</td>

<td>₦${product.transport.toLocaleString()}</td>

<td>₦${order.totalPaid.toLocaleString()}</td>

<td>${order.status}</td>

<td>${new Date(order.date).toLocaleDateString()}</td>

</tr>

`;

        });

    });

}