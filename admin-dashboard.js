const token = localStorage.getItem("token");

loadDashboard();

loadOrders();

async function loadDashboard() {

    const res = await fetch(

        "https://a-s-ventures-backend.onrender.com/api/admin/dashboard",

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

        "https://a-s-ventures-backend.onrender.com/api/admin/orders",

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

<td>₦${Number(product.farmerPrice || 0).toLocaleString()}</td>

<td>₦${Number(product.commission || 0).toLocaleString()}</td>

<td>₦${Number(product.transport || 0).toLocaleString()}</td>

<td>
    ₦${Number(order.totalPaid || 0).toLocaleString()}
</td>

<td>
    <span class="status">
        ${order.status}
    </span>
</td>

<td>${new Date(order.date).toLocaleDateString()}</td>

</tr>

`;

        });

    });

}