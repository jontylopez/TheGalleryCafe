document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);

    fetch('/gallerycafe/php/register.php', {
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
            alert('Customer Registration successful!');
            this.reset(); 
            location.reload();
            document.getElementById('first-name').focus();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Error: ' + error.message;
        errorMessage.style.display = 'block';
        console.error('Error:', error);
    });
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            const { bottom } = activeElement.getBoundingClientRect();
            if (bottom > window.innerHeight) {
                const scrollAmount = bottom - window.innerHeight + 10;
                window.scrollBy({
                    top: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    }
});
