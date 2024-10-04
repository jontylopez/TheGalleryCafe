document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('create-user-link').addEventListener('click', loadCreateUserForm);
    document.getElementById('view-users-link').addEventListener('click', loadViewUsers);
    document.getElementById('food-menu-link').addEventListener('click', loadFoodMenu);
    document.getElementById('view-feedbacks-link').addEventListener('click', loadViewFeedbacks);
    document.getElementById('change-password-link').addEventListener('click', changePasswordForm);

    
    document.getElementById('admin-content').addEventListener('submit', function(event) {
        event.preventDefault(); 

        const form = event.target;
        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (error) {
                    throw new Error('Invalid JSON: ' + text);
                }
            });
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Operation successful!');
                form.reset(); 
                loadCreateUserForm();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Operation failed');
        });
    });
});

function loadCreateUserForm() {
    const content = `
        <h3>Create User</h3>
        <form id="add-staff-form" method="POST" action="/gallerycafe/php/create_user.php">
            <div class="form-group">
                <label for="staff-fname">Full Name:</label>
                <input type="text" id="staff-fname" name="first-name" placeholder="Enter full name" required>
            </div>
            <div class="form-group">
                <label for="staff-email">Email:</label>
                <input type="email" id="staff-email" name="email" placeholder="Enter email address" required>
            </div>
            <div class="form-group">
                <label for="staff-username">Username:</label>
                <input type="text" id="staff-username" name="new-username" placeholder="Enter username" required>
            </div>
            <div class="form-group">
                <label for="staff-password">Password:</label>
                <input type="password" id="staff-password" name="new-password" placeholder="Enter password" required>
            </div>
            <div class="form-group">
                <label for="staff-role">Role:</label>
                <select id="staff-role" name="new-role" required>
                    <option value="adm">Admin</option>
                    <option value="stf">Staff</option>
                </select>
            </div>
            <button type="submit" class="button">Add Staff</button>
        </form>
    `;
    document.getElementById('admin-content').innerHTML = content;
}

function loadViewUsers() {
    fetch('/gallerycafe/php/fetch_users.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const users = data.data;
                let content = `
                    <h3>View Users</h3>
                    <div class="search-container">
                        <input type="text" id="search-box1" placeholder="Search by name, email, or username">
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Actions</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="user-menu-table-body">`;
                users.forEach(user => {
                    content += `
                        <tr>
                            <td contenteditable="true" data-id="${user.id}" data-field="fName">${user.fName}</td>
                            <td contenteditable="true" data-id="${user.id}" data-field="email">${user.email}</td>
                            <td contenteditable="true" data-id="${user.id}" data-field="uName">${user.uName}</td>
                            <td>
                            <span>${user.uRole === 'adm' ? 'Admin' : user.uRole === 'stf' ? 'Staff' : 'Customer'}</span>
                            </td>
                            <td>
                                <button onclick="deleteUser(${user.id})" class="button">Delete</button>
                            </td>
                            <td>
                                <button onclick="updateUser(${user.id})" class="button">Update</button>
                            </td>
                        </tr>`;
                });
                content += `</tbody></table>`;
                document.getElementById('admin-content').innerHTML = content;

                //here we add event listner to the search box
                document.getElementById('search-box1').addEventListener('input', searchUsers);

                
                document.querySelectorAll('[contenteditable="true"]').forEach(cell => {
                    cell.addEventListener('blur', function() {
                        updateUser(cell.dataset.id, cell.dataset.field, cell.textContent);
                    });
                });
            } else {
                alert('Failed to fetch users');
            }
        })
        .catch(error => console.error('Error:', error));
}


function updateUser(id, field, value) {
    fetch('/gallerycafe/php/update_users.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, field, value }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('User Updated successfully');
                loadViewUsers(); 
            } else {
                alert('Failed to Update User');
            }
        })
        .catch(error => console.error('Error:', error));
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch('/gallerycafe/php/delete_users.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('User Deleted successfully');
                loadViewUsers(); 
            } else {
                alert('Failed to Delete User');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function loadFoodMenu() {
    console.log('Loading food menu...');
    fetch('/gallerycafe/php/fetch_foodmenu.php')
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
            if (data.status === 'success') {
                const menuItems = data.data;
                let content = `
                    <h3>Add New Food Item</h3>
                    <form id="add-food-item-form" method="POST" action="/gallerycafe/php/add_fooditem.php" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="cuisine">Cuisine:</label>
                            <select id="cuisine" name="cuisine" required>
                                <option value="sl">Sri Lankan</option>
                                <option value="in">Indian</option>
                                <option value="ch">Chinese</option>
                                <option value="it">Italian</option>
                                <option value="bv">Beverages</option>
                                <option value="ds">Desserts</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="nameF">Name:</label>
                            <input type="text" id="nameF" name="nameF" placeholder="Enter food name" required>
                        </div>
                        <div class="form-group">
                            <label for="price">Price:</label>
                            <input type="number" step="0.01" id="price" name="price" placeholder="Enter price" required>
                        </div>
                        <div class="form-group">
                            <label for="quantity">Quantity:</label>
                            <input type="number" id="quantity" name="quantity" placeholder="Enter quantity" required>
                        </div>
                        <div class="form-group">
                            <label for="description">Description:</label>
                            <input type="text" id="description" name="description" placeholder="Enter description" required>
                        </div>
                        <div class="form-group">
                            <label for="imageF">Image:</label>
                            <input type="file" id="imageF" name="imageF" accept="image/*" required>
                        </div>
                        <button type="submit" class="button">Add Food Item</button>
                    </form>
                    <h3>Search Food Menu</h3>
                    <div class="search-container">
                        <input type="text" id="search-box" placeholder="Search by Name, Price, or Cuisine">
                    </div>
                    <h3>Food Menu</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Cuisine</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="food-menu-table-body">`;
                menuItems.forEach(item => {
                    content += `
                        <tr>
                            <td>${item.cuisine}</td>
                            <td contenteditable="true" data-id="${item.id}" data-field="nameF">${item.nameF}</td>
                            <td contenteditable="true" data-id="${item.id}" data-field="price">${item.price}</td>
                            <td contenteditable="true" data-id="${item.id}" data-field="quantity">${item.quantity}</td>
                            <td contenteditable="true" data-id="${item.id}" data-field="description">${item.descriptionF}</td>
                            <td><img src="data:image/jpeg;base64,${item.imageF}" alt="${item.nameF}" width="50"></td>
                            <td>
                                <button onclick="deleteFoodItem(${item.id})" class="button">Delete</button>
                                <button onclick="updateFoodItem(${item.id})" class="button">Update</button>
                            </td>
                        </tr>`;
                });
                content += `</tbody></table>`;
                document.getElementById('admin-content').innerHTML = content;

                // Add event listeners for search box
                document.getElementById('search-box').addEventListener('input', searchFoodMenu);

                // Add event listeners for contenteditable fields
                document.querySelectorAll('[contenteditable="true"]').forEach(cell => {
                    cell.addEventListener('blur', function() {
                        updateFoodItem(cell.dataset.id, cell.dataset.field, cell.textContent);
                    });
                });
            } else {
                console.error('Failed to fetch food menu:', data.message);
                alert('Failed to fetch food menu');
            }
        })
        .catch(error => console.error('Error:', error));
}

function searchFoodMenu() {
    const searchValue = document.getElementById('search-box').value.toLowerCase();
    const rows = document.querySelectorAll('#food-menu-table-body tr');
    rows.forEach(row => {
        const cuisine = row.children[0].textContent.toLowerCase();
        const name = row.children[1].textContent.toLowerCase();
        const price = row.children[2].textContent.toLowerCase();
        if (cuisine.includes(searchValue) || name.includes(searchValue) || price.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function searchUsers() {
    const searchValue = document.getElementById('search-box1').value.toLowerCase();
    const rows = document.querySelectorAll('#user-menu-table-body tr');
    rows.forEach(row => {
        const fullName = row.children[0].textContent.toLowerCase();
        const email = row.children[1].textContent.toLowerCase();
        const username = row.children[2].textContent.toLowerCase();
        if (fullName.includes(searchValue) || email.includes(searchValue) || username.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function updateFoodItem(id, field, value) {
    fetch('/gallerycafe/php/update_fooditem.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, field, value }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Reload the food menu without redirecting the page
            loadFoodMenu();
            alert('Food item updated successfully');
        } else {
            alert('Failed to update food item');
        }
    })
    .catch(error => console.error('Error:', error));
}

function deleteFoodItem(id) {
    if (confirm('Are you sure you want to delete this food item?')) {
        fetch('/gallerycafe/php/delete_fooditem.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Reload the food menu without redirecting the page
                loadFoodMenu();
                alert('Food item deleted successfully');
            } else {
                alert('Failed to delete food item');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function loadViewFeedbacks() {
    fetch('/gallerycafe/php/fetch_feedbacks.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const feedbacks = data.data;
                let content = `
                    <h3>View Feedbacks</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Feedback</th>
                                <th>Submitted At</th>
                            </tr>
                        </thead>
                        <tbody>`;
                feedbacks.forEach(feedback => {
                    content += `
                        <tr>
                            <td>${feedback.fName}</td>
                            <td>${feedback.uName}</td>
                            <td>${feedback.email}</td>
                            <td>${feedback.feedback}</td>
                            <td>${feedback.created_at}</td>
                        </tr>`;
                });
                content += `</tbody></table>`;
                document.getElementById('admin-content').innerHTML = content;
            } else {
                alert('Failed to fetch feedbacks');
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
    document.getElementById('admin-content').innerHTML = content;
}

function getUsername() {
    return "<?php echo $_SESSION['username']; ?>"; // here we get actual users username to the session
}
