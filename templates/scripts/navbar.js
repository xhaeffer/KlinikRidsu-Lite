document.addEventListener('DOMContentLoaded', function () {
  // Mendapatkan referensi elemen ikon menu dan daftar menu
  const menuIcon = document.getElementById('menu-icon');
  const menuList = document.getElementById('menu-list');

  // Menambahkan event listener untuk merespons klik pada ikon menu
  menuIcon.addEventListener('click', function () {
    // Mengganti atau menambahkan kelas 'show' pada daftar menu untuk menampilkan atau menyembunyikan menu
    menuList.classList.toggle('show');
  });

  // Menambahkan event listener untuk merespons klik di luar ikon menu dan daftar menu
  document.addEventListener('click', function (event) {
    // Memeriksa apakah yang diklik adalah bagian dari daftar menu atau ikon menu
    const isMenu = menuList.contains(event.target);
    const isIcon = menuIcon.contains(event.target);

    // Jika yang diklik bukan bagian dari daftar menu atau ikon menu, menyembunyikan menu
    if (!isMenu && !isIcon) {
      menuList.classList.remove('show');
    }
  });
});
