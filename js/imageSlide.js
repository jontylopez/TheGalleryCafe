document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.photo-container');
    const images = container.querySelectorAll('img');
    let currentIndex = 0;

    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        const offset = -currentIndex * 100;
        container.style.transform = `translateX(${offset}%)`;
    }

    setInterval(showNextImage, 3000); // here we can change image every 3 seconds
});
