document.addEventListener('DOMContentLoaded', function() {
    
    fetch('/gallerycafe/php/get_username.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.querySelector('.user-menu a').innerHTML = `${data.username} <i class="fa fa-caret-down"></i>`;
            }
        });

    document.getElementById('home-link').addEventListener('click', loadHome);
    document.getElementById('reservations-link').addEventListener('click', loadReservations);
    document.getElementById('orders-link').addEventListener('click', loadOrders);
    document.getElementById('change-password-link').addEventListener('click', changePasswordForm);

    loadHome(); // default load location is home

    addValidation();
});

function addValidation() {
    const fields = document.querySelectorAll('input, select');
    fields.forEach(field => {
        field.addEventListener('change', function() {
            if (!field.checkValidity()) {
                field.reportValidity();
            }
        });
    });
}

function loadHome() {
    const content = `
        <h2>Welcome to the Staff Portal</h2>
        <p>Select an option from the menu to get started.</p>
        <div class="photo-box">
                <div class="photo-container">
                    <img src="/gallerycafe/images/Staff.jpg" >
                </div>
            </div>
    `;
    document.getElementById('staff-content').innerHTML = content;
}

function loadReservations() {
    const content = `
        <h3>Customer Reservations</h3>
        <table id="reservations-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Parking</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="reservations">
                <!-- Reservation details will be loaded here -->
            </tbody>
        </table>
    `;
    document.getElementById('staff-content').innerHTML = content;

    fetch('/gallerycafe/php/get_reservations.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const reservationsTbody = document.getElementById('reservations');
                reservationsTbody.innerHTML = '';
                data.reservations.forEach(reservation => {
                    const reservationRow = document.createElement('tr');
                    
                    const dateCell = document.createElement('td');
                    dateCell.textContent = reservation.date;
                    
                    const timeCell = document.createElement('td');
                    timeCell.textContent = reservation.time;
                    
                    const parkingCell = document.createElement('td');
                    parkingCell.textContent = reservation.parking;
                    
                    const actionsCell = document.createElement('td');
                    
                    const approveButton = document.createElement('button');
                    approveButton.textContent = 'Approve';
                    approveButton.classList.add('button'); 
                    approveButton.addEventListener('click', () => approveReservation(reservation.id));
                    
                    const denyButton = document.createElement('button');
                    denyButton.textContent = 'Deny';
                    denyButton.classList.add('button'); 
                    denyButton.addEventListener('click', () => denyReservation(reservation.id));
                    
                    actionsCell.appendChild(approveButton);
                    actionsCell.appendChild(denyButton);
                    
                    reservationRow.appendChild(dateCell);
                    reservationRow.appendChild(timeCell);
                    reservationRow.appendChild(parkingCell);
                    reservationRow.appendChild(actionsCell);
                    
                    reservationsTbody.appendChild(reservationRow);
                });
            } else {
                console.error('Failed to load reservations:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}


function approveReservation(reservationId) {
    fetch('/gallerycafe/php/approve_reservation.php', {
        method: 'POST',
        body: JSON.stringify({ reservationId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loadReservations();
        } else {
            console.error('Failed to approve reservation:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function denyReservation(reservationId) {
    fetch('/gallerycafe/php/deny_reservation.php', {
        method: 'POST',
        body: JSON.stringify({ reservationId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loadReservations();
        } else {
            console.error('Failed to deny reservation:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function loadOrders() {
    const content = `
        <h3>Pre-ordered Food</h3>
        <table id="orders-table">
            <thead>
                <tr>
                    <th>Items</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="orders">
                <!-- Order details will be loaded here -->
            </tbody>
        </table>
    `;
    document.getElementById('staff-content').innerHTML = content;

    fetch('/gallerycafe/php/get_orders.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const ordersTbody = document.getElementById('orders');
                ordersTbody.innerHTML = '';
                data.orders.forEach(order => {
                    const orderRow = document.createElement('tr');
                    
                    const itemsCell = document.createElement('td');
                    itemsCell.textContent = order.items;
                    
                    const actionsCell = document.createElement('td');
                    
                    const approveButton = document.createElement('button');
                    approveButton.textContent = 'Approve';
                    approveButton.classList.add('button'); 
                    approveButton.addEventListener('click', () => approveOrder(order.id));
                    
                    const denyButton = document.createElement('button');
                    denyButton.textContent = 'Deny';
                    denyButton.classList.add('button'); 
                    denyButton.addEventListener('click', () => denyOrder(order.id));
                    
                    actionsCell.appendChild(approveButton);
                    actionsCell.appendChild(denyButton);
                    
                    orderRow.appendChild(itemsCell);
                    orderRow.appendChild(actionsCell);
                    
                    ordersTbody.appendChild(orderRow);
                });
            } else {
                console.error('Failed to load orders:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}


function approveOrder(orderId) {
    fetch('/gallerycafe/php/approve_order.php', {
        method: 'POST',
        body: JSON.stringify({ orderId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loadOrders();
        } else {
            console.error('Failed to approve order:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function denyOrder(orderId) {
    fetch('/gallerycafe/php/deny_order.php', {
        method: 'POST',
        body: JSON.stringify({ orderId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loadOrders();
        } else {
            console.error('Failed to deny order:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
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
    document.getElementById('staff-content').innerHTML = content;
}

function getUsername() {
    return "<?php echo $_SESSION['username']; ?>"; // here we get actual users username to the session
}
