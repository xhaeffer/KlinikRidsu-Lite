function showPopup() {
    // Simulasi mendapatkan ID Reservasi setelah berhasil reservasi
    var reservasiId = generateReservasiId(); // Anda dapat menggantinya sesuai kebutuhan

    // Tampilkan overlay dan set ID Reservasi di dalam popup
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('reservasi-id').innerText = reservasiId;
}

function closePopup() {
    // Tutup popup saat tombol OK diklik
    document.getElementById('overlay').style.display = 'none';
}

function generateReservasiId() {
    // Simulasi pembuatan ID Reservasi (Anda dapat menggantinya sesuai kebutuhan)
    return 'R' + Math.floor(Math.random() * 1000);
}