document.addEventListener('DOMContentLoaded', function() {
    //we can get the cuisine code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const cuisine = urlParams.get('cuisine') || '';

    fetchFoodMenu(cuisine);

    document.getElementById('search-box').addEventListener('input', function() {
        filterFoodMenu(this.value.toLowerCase());
    });
});

function fetchFoodMenu(cuisine) {
    fetch(`/gallerycafe/php/fetch_foodmenu_public.php?cuisine=${cuisine}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const foodItems = data.data;
                let content = '';
                foodItems.forEach(item => {
                    content += `
                        <div class="food-item" data-name="${item.nameF.toLowerCase()}" data-price="${item.price}">
                            <img src="data:image/jpeg;base64,${item.imageF}" alt="${item.nameF}" class="food-image">
                            <div class="food-details">
                                <h3>${item.nameF}</h3>
                                <p>Price: RS ${item.price}</p>
                                <p>${item.descriptionF}</p>
                            </div>
                        </div>
                    `;
                });
                document.getElementById('food-table-body').innerHTML = content;
            } else {
                document.getElementById('food-table-body').innerHTML = '<p>No food items found.</p>';
            }
        })
        .catch(error => console.error('Error:', error));
}

function filterFoodMenu(query) {
    const foodItems = document.querySelectorAll('.food-item');
    foodItems.forEach(item => {
        const name = item.getAttribute('data-name');
        const price = item.getAttribute('data-price');
        if (name.includes(query) || price.includes(query)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}
