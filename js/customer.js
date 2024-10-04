document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('table-reservation-link').addEventListener('click', loadTableReservationForm);
    document.getElementById('order-food-link').addEventListener('click', loadOrderFood);
    document.getElementById('feedback-link').addEventListener('click', loadFeedbackForm);
    document.getElementById('my-reservations-link').addEventListener('click', loadMyReservations);
    document.getElementById('my-orders-link').addEventListener('click', loadMyOrders);
    document.getElementById('change-password-link').addEventListener('click', changePasswordForm);
});

function loadTableReservationForm() {
    const content = `
        <h3>Table Reservation</h3>
        <form id="table-reservation-form" method="POST" action="/gallerycafe/php/reserve_table.php">
            <div class="form-group">
                <label for="customer-name">Name:</label>
                <input type="text" id="customer-name" name="name" placeholder="Enter your name" required>
            </div>
            <div class="form-group">
                <label for="guest-count">Number of Guests:</label>
                <input type="number" id="guest-count" name="guest-count" placeholder="Enter number of guests" required>
            </div>
            <div class="form-group">
                <label for="reservation-date">Date:</label>
                <input type="date" id="reservation-date" name="date" required>
            </div>
            <div class="form-group">
                <label for="arrival-time">Time of Arrival:</label>
                <input type="time" id="arrival-time" name="arrival-time" required>
            </div>
            <div class="form-group">
                <label for="parking-space">Need Parking Space:</label>
                <select id="parking-space" name="parking-space" required>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
            <button type="submit" class="button">Reserve Table</button>
        </form>
    `;
    document.getElementById('customer-content').innerHTML = content;

    document.getElementById('table-reservation-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        fetch('/gallerycafe/php/reserve_table.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                window.location.href = '/gallerycafe/html/customer.html';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            alert('An error occurred: ' + error.message);
        });
    });
}

function loadOrderFood() {
    const content = `
        <h3>Order Food</h3>
        <div class="form-group">
            <label for="cuisine">Choose Cuisine:</label>
            <select id="cuisine" name="cuisine" onchange="loadCuisineItems()" required>
                <option value="">Select Cuisine</option>    
                <option value="sl">Sri Lankan</option>
                <option value="in">Indian</option>
                <option value="ch">Chinese</option>
                <option value="it">Italian</option>
                <option value="bv">Beverages</option>
                <option value="ds">Desserts</option>
            </select>
        </div>
        <div id="cuisine-items">
            <!-- Food items will be loaded here -->
        </div>
        <div id="cart">
            <h3>Your Cart</h3>
            <div id="cart-items"></div>
            <p>Total: Rs <span id="total-price">0.00</span></p>
            <button onclick="placeOrder()" class="button">Place Order</button>
        </div>
    `;
    document.getElementById('customer-content').innerHTML = content;
}

function loadCuisineItems() {
    const cuisine = document.getElementById('cuisine').value;

    
    if (!cuisine) {
        document.getElementById('cuisine-items').innerHTML = '';
        alert('Please select a valid cuisine.');
        return;
    }

    fetch(`/gallerycafe/php/fetch_foodmenu_public.php?cuisine=${cuisine}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const menuItems = data.data;
                let content = `
                    <h3>Menu Items</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Menu Item</th>
                                <th>Quantity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
    
                menuItems.forEach(item => {
                    content += `
                        <tr>
                            <td>${item.nameF} - RS ${item.price}</td>
                            <td><input type="number" id="quantity-${item.id}" name="quantity" min="1" value="1" style="width: 50px;"></td>
                            <td><button onclick="addToCart(${item.id}, '${item.nameF}', ${item.price})" class="button">Add to Cart</button></td>
                        </tr>
                    `;
                });
    
                content += `
                        </tbody>
                    </table>
                `;
    
                document.getElementById('cuisine-items').innerHTML = content;
            } else {
                alert('Failed to load menu items');
            }
        })
        .catch(error => console.error('Error:', error));
    }
    

let cart = [];
let totalPrice = 0;

function addToCart(id, name, price) {
    const quantity = parseInt(document.getElementById(`quantity-${id}`).value);
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({ id, name, price, quantity });
    }
    totalPrice += price * quantity;
    updateCart();
}

function updateCart() {
    let content = '';
    cart.forEach(item => {
        content += `<p>${item.name} - ${item.quantity} x Rs ${item.price} = Rs ${(item.quantity * item.price).toFixed(2)}</p>`;
    });
    document.getElementById('cart-items').innerHTML = content;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function placeOrder() {
    fetch('/gallerycafe/php/place_order.php', {
        method: 'POST',
        body: JSON.stringify({ items: cart, total: totalPrice }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Order placed successfully!');
            cart = [];
            totalPrice = 0;
            updateCart();
        } else {
            alert('Failed to place order');
        }
    })
    .catch(error => console.error('Error:', error));
}

function loadFeedbackForm() {
    const content = `
        <h3>Feedback</h3>
        <form id="feedback-form" method="POST" action="/gallerycafe/php/submit_feedback.php">
            <div class="form-group">
                <label for="feedback-message">Your Feedback:</label>
                <textarea id="feedback-message" name="message" placeholder="Enter your feedback" required style="width: 100%; height: 150px;"></textarea>
            </div>
            <button type="submit" class="button">Submit Feedback</button>
        </form>
    `;
    document.getElementById('customer-content').innerHTML = content;

    document.getElementById('feedback-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        fetch('/gallerycafe/php/submit_feedback.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                this.reset();  
                document.getElementById('feedback-message').focus();  
            } else {
                alert(data.message);  
            }
        })
        .catch(error => {
            alert('An error occurred: ' + error.message); 
            console.error('Error:', error);
        });
    });
}

function changePasswordForm() {
    const content = `
        <h3>Change Password</h3>
        <form id="change-password-form" method="POST" action="/gallerycafe/php/change_password.php">
            <input type="hidden" name="username" value="${getUsername()}">
            <div class="form-group">
                <label for="old-password">Old Password:</label>
                <input type="password" id="old-password" name="old-password" placeholder="Enter old password" required>
            </div>
            <div class="form-group">
                <label for="new-password">New Password:</label>
                <input type="password" id="new-password" name="new-password" placeholder="Enter new password" required>
            </div>
            <div class="form-group">
                <label for="confirm-new-password">Confirm New Password:</label>
                <input type="password" id="confirm-new-password" name="confirm-new-password" placeholder="Confirm new password" required>
            </div>
            <button type="submit" class="button">Change Password</button>
        </form>
    `;
    document.getElementById('customer-content').innerHTML = content;
}

function loadMyReservations() {
    fetch('/gallerycafe/php/get_my_reservations.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const reservations = data.data;
                let content = `
                    <h3>My Reservations</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                reservations.forEach(reservation => {
                    content += `
                        <tr>
                            <td>${reservation.date}</td>
                            <td>${reservation.time}</td>
                            <td>${reservation.status}</td>
                        </tr>
                    `;
                });
                content += `
                        </tbody>
                    </table>
                `;
                document.getElementById('customer-content').innerHTML = content;
            } else {
                alert('Failed to load reservations: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function loadMyOrders() {
    fetch('/gallerycafe/php/get_my_orders.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const orders = data.data;
                let content = `
                    <h3>My Orders</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Items</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                orders.forEach(order => {
                    content += `
                        <tr>
                            <td>${order.items}</td>
                            <td>${order.status}</td>
                        </tr>
                    `;
                });
                content += `
                        </tbody>
                    </table>
                `;
                document.getElementById('customer-content').innerHTML = content;
            } else {
                alert('Failed to load orders: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function getUsername() {
    return "<?php echo $_SESSION['username']; ?>"; // here we get actual users username to the session
}
