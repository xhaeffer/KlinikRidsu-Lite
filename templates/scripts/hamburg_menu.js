document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.getElementById('menu-icon');
    const menuList = document.getElementById('menu-list');

    menuIcon.addEventListener('click', function () {
        menuList.classList.toggle('show');
    });

    document.addEventListener('click', function (event) {
        const isMenu = menuList.contains(event.target);
        const isIcon = menuIcon.contains(event.target);

        if (!isMenu && !isIcon) {
            menuList.classList.remove('show');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var animatedDiv = document.getElementById('animated-div');
  
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
  
  