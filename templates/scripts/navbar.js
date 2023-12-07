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
