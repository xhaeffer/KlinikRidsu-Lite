document.addEventListener('DOMContentLoaded', function () {
    // Mendapatkan referensi elemen dengan ID 'animated-div'
    const animatedDiv = document.getElementById('animated-div');

    // Fungsi untuk menampilkan elemen dengan efek fadeIn saat di-scroll
    function fadeInOnScroll() {
        // Mendapatkan informasi rektangle (koordinat) dari elemen
        var rect = animatedDiv.getBoundingClientRect();

        // Mengecek apakah elemen terlihat di dalam jendela browser
        var isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        // Jika elemen terlihat, tambahkan kelas 'show' untuk efek fadeIn
        if (isVisible) {
            animatedDiv.classList.add('show');
            
            // Hapus event listener agar efek fadeIn hanya terjadi sekali
            window.removeEventListener('scroll', fadeInOnScroll);
        }
    }

    // Menambahkan event listener untuk mendeteksi scroll
    window.addEventListener('scroll', fadeInOnScroll);

    // Memanggil fungsi fadeInOnScroll saat halaman dimuat untuk menangani kasus elemen yang langsung terlihat
    fadeInOnScroll();
});
