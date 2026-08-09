const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

loadDashboard();

async function loadDashboard() {

    try {

        const res = await fetch(
            "https://a-s-ventures-backend.onrender.com/api/farmer-dashboard",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(
                data.message || "Failed to load dashboard"
            );
        }


        // ==============================
        // STATS
        // ==============================

        document.getElementById("products").textContent =
            data.productsUploaded || 0;

        document.getElementById("orders").textContent =
            data.ordersReceived || 0;

        document.getElementById("revenue").textContent =
            "₦" +
            Number(data.revenue || 0).toLocaleString();


        // ==============================
        // ORDERS
        // ==============================

        const table =
            document.getElementById("ordersTable");

        table.innerHTML = "";


        if (
            !data.orders ||
            data.orders.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td colspan="11">
                        No orders received yet.
                    </td>
                </tr>
            `;

            return;
        }


        data.orders.forEach(order => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${order.buyer?.fullname || "N/A"}
                    </td>

                    <td>
                        ${order.buyer?.phone || "N/A"}
                    </td>

                    <td>
                        ${order.delivery?.whatsapp || "N/A"}
                    </td>

                    <td>
                        ${order.delivery
                    ? `${order.delivery.address || ""}, ${order.delivery.state || ""}`
                    : "N/A"
                }
                    </td>

                    <td>
                        ${order.product || "N/A"}
                    </td>

                    <td>
                        ${order.quantity || 0}
                    </td>

                    <td>
                        ₦${Number(
                    order.farmerPrice || 0
                ).toLocaleString()}
                    </td>

                    <td>
                        ₦${Number(
                    order.commission || 0
                ).toLocaleString()}
                    </td>

                    <td>
                        ₦${Number(
                    order.transport || 0
                ).toLocaleString()}
                    </td>

                    <td>
                        ₦${Number(
                    order.buyerPaid || 0
                ).toLocaleString()}
                    </td>

                    <td>

                        <select
                            onchange="updateStatus(
                                '${order.orderId}',
                                this.value
                            )"
                        >

                            <option
                                value="Pending"
                                ${order.status === "Pending" ? "selected" : ""}
                            >
                                Pending
                            </option>

                            <option
                                value="Processing"
                                ${order.status === "Processing" ? "selected" : ""}
                            >
                                Processing
                            </option>

                            <option
                                value="Shipped"
                                ${order.status === "Shipped" ? "selected" : ""}
                            >
                                Shipped
                            </option>

                            <option
                                value="Delivered"
                                ${order.status === "Delivered" ? "selected" : ""}
                            >
                                Delivered
                            </option>

                            <option
                                value="Cancelled"
                                ${order.status === "Cancelled" ? "selected" : ""}
                            >
                                Cancelled
                            </option>

                        </select>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(
            "FARMER DASHBOARD ERROR:",
            error
        );

    }

}


async function updateStatus(id, status) {

    try {

        const res = await fetch(

            `https://a-s-ventures-backend.onrender.com/api/farmer-dashboard/${id}/status`,

            {

                method: "PATCH",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`

                },

                body: JSON.stringify({
                    status
                })

            }

        );

        const data =
            await res.json();


        if (!res.ok) {

            alert(
                data.message ||
                "Could not update status."
            );

            return;
        }


        alert(data.message);

        loadDashboard();

    } catch (error) {

        console.error(
            "UPDATE STATUS ERROR:",
            error
        );

        alert(
            "Something went wrong while updating the order."
        );

    }

}