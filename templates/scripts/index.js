document.addEventListener('DOMContentLoaded', function () {
    const animatedDiv = document.getElementById('animated-div');

    function fadeInOnScroll() {
        var rect = animatedDiv.getBoundingClientRect();
        var isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isVisible) {
            animatedDiv.classList.add('show');
            window.removeEventListener('scroll', fadeInOnScroll);
        }
    }

    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Trigger on page load
});
