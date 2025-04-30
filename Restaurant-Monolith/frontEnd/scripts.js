const API_ENDPOINT = 'http://localhost:3001';
const BILLING_API_ENDPOINT = 'http://localhost:3003'; // Define billing API endpoint

// Function to place an order
function placeOrder() {
    const item = document.getElementById('order-item').value;
    const quantity = document.getElementById('order-quantity').value;

    fetch(`${API_ENDPOINT}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            item: item,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        alert('Order placed and cooking started!');
        loadOrders();
    })
    .catch(error => {
        alert('Error placing order.');
    });
}

// Function to load the orders (which are automatically cooking)
function loadOrders() {
    fetch(`${API_ENDPOINT}/orders`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load orders');
        }
        return response.json();
    })
    .then(data => {
        // Populate the orders list (cooking)
        const list = document.getElementById('orders-list');
        list.innerHTML = '';
        data.forEach(order => {
            const li = document.createElement('li');
            li.textContent = `Order ID: ${order.id}, Item: ${order.item}, Quantity: ${order.quantity}`;
            list.appendChild(li);
        });

        // Populate the dropdown in the billing modal
        const dropdown = document.getElementById('order-bill');
        dropdown.innerHTML = '';
        data.forEach(order => {
            const option = document.createElement('option');
            option.value = order.id;
            option.textContent = `Order ID: ${order.id} - Item: ${order.item}`;
            dropdown.appendChild(option);
        });
    })
    .catch(error => {
        alert('Error loading orders: ' + error.message);
    });
}

// Function to open the billing modal
function openBillModal() {
    const modal = document.getElementById('bill-modal');
    modal.style.display = "block";
    void modal.offsetHeight;
}

// Function to close the billing modal
function closeBillModal() {
    const modal = document.getElementById('bill-modal');
    modal.style.display = "none";
}

// Function to create a bill for a selected order
function createBill() {
    const orderID = document.getElementById('order-bill').value;
    const amount = document.getElementById('bill-amount').value;

    if (!orderID) {
        alert('Please select an order.');
        return;
    }

    if (!amount || isNaN(amount) || parseInt(amount, 10) <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    fetch(`${BILLING_API_ENDPOINT}/billing`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            order_id: parseInt(orderID, 10), // Ensure the order_id is a number
            amount: parseInt(amount, 10)
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Error creating bill.');
            });
        }
        return response.json();
    })
    .then(data => {
        alert('Bill created!');
        loadBills();
        closeBillModal();
    })
    .catch(error => {
        alert('Error creating bill: ' + error.message);
    });
}

// Function to load and display all the bills
function loadBills() {
    fetch(`${BILLING_API_ENDPOINT}/billing`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load bills');
        }
        return response.json();
    })
    .then(data => {
        const list = document.getElementById('bills-list');
        list.innerHTML = '';
        data.forEach(bill => {
            const li = document.createElement('li');
            li.textContent = `Bill ID: ${bill.id}, Order ID: ${bill.order_id}, Amount: $${bill.amount}`;
            list.appendChild(li);
        });
    })
    .catch(error => {
        alert('Error loading bills: ' + error.message);
    });
}

// Close the modal when clicking outside of it or pressing ESC
window.onclick = function(event) {
    const modal = document.getElementById('bill-modal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Close the modal if ESC key is pressed
window.addEventListener('keydown', function(event) {
    const modal = document.getElementById('bill-modal');
    if (event.key === "Escape") {
        modal.style.display = "none";
    }
});

// Load orders and bills on page load
window.onload = () => {
    loadOrders();
    loadBills();
    closeBillModal();
};
