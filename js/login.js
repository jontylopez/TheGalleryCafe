document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch('/gallerycafe/php/login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(text => {
        console.log('Raw response:', text); 
        const data = JSON.parse(text); 
        if (data.status === 'success') {
            if (data.uRole === 'cus') {
                window.location.href = '/gallerycafe/html/customer.html';
            } else if (data.uRole === 'stf') {
                window.location.href = '/gallerycafe/html/staff.html';
            } else if (data.uRole === 'adm') {
                window.location.href = '/gallerycafe/html/admin.html';
            }
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
