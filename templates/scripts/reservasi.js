// Fungsi untuk mengirim data reservasi ke server
function submitReservasi() {
    // Mengambil data dari elemen formulir reservasi
    const formData = {
        NoRS: parseInt(document.getElementsByName("NoRS")[0].value),
        NIK: parseInt(document.getElementsByName("NIK")[0].value),
        Nama: document.getElementsByName("Nama")[0].value,
        TglLahir: document.getElementsByName("TglLahir")[0].value,
        JenisKelamin: document.getElementsByName("JenisKelamin")[0].value,
        Poli: document.getElementsByName("Poli")[0].value,
        Dokter: document.getElementsByName("Dokter")[0].value,
        TglKunjungan: document.getElementsByName("TglKunjungan")[0].value,
        Pembayaran: document.getElementsByName("Pembayaran")[0].value,
        NoTelp: document.getElementsByName("NoTelp")[0].value,
        Email: document.getElementsByName("Email")[0].value,
    };

    // Mengirim data ke server menggunakan metode POST
    fetch('/reservasi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        // Menampilkan pesan sukses setelah reservasi berhasil
        alert("Reservasi Berhasil!");
    })
    .catch(error => {
        // Menampilkan pesan error jika terjadi kesalahan
        console.error('Error submitting reservation:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Mendapatkan referensi elemen dropdown dan identitas dokter
    const poliDropdown = document.getElementById('poliDropdown');
    const dokterDropdown = document.getElementById('dokterDropdown');
    const identitasDokter = document.getElementById('doctorCard');

    // Mengambil data poli dari server dan mengisi dropdown poli
    fetch('/jadwal/api/getPoli')
        .then(response => response.json())
        .then(data => {
            data.forEach(poli => {
                const option = document.createElement('option');
                option.value = poli;
                option.textContent = poli;
                poliDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching poli:', error));

    // Menambahkan event listener pada dropdown poli
    poliDropdown.addEventListener('change', function () {
        const selectedPoli = poliDropdown.value;

        // Mengambil data dokter berdasarkan poli yang dipilih
        fetch(`/jadwal/api/byPoli/${selectedPoli}`)
            .then(response => response.json())
            .then(data => {
                // Mengosongkan dropdown dokter
                dokterDropdown.innerHTML = '<option value="" selected disabled>Pilih Dokter</option>';

                // Mendapatkan dokter unik dari data jadwal
                const uniqueDokters = new Set(data[0].JadwalDokter.map(jadwal => data[0]));

                // Mengisi dropdown dokter dengan dokter-dokter yang unik
                uniqueDokters.forEach(dokter => {
                    const option = document.createElement('option');
                    option.value = dokter.nama_dokter;
                    option.textContent = dokter.nama_dokter;
                    option.dataset.dokterId = dokter.id_dokter;
                    dokterDropdown.appendChild(option);
                });

                // Menambahkan event listener pada dropdown dokter
                dokterDropdown.addEventListener('change', function () {
                    const selectedDokter = dokterDropdown.options[dokterDropdown.selectedIndex];
                    const selectedDokterId = selectedDokter.dataset.dokterId;

                    // Mengambil data jadwal dokter berdasarkan ID dokter
                    fetch(`/jadwal/api/byID/${selectedDokterId}`)
                        .then(response => response.json())
                        .then(data => {                            
                            // Mengisi identitas dokter dengan data yang diperoleh
                            identitasDokter.querySelector('h2').textContent = data[0].nama_dokter;
                            identitasDokter.querySelector('h3').textContent = `Poli: ${data[0].poli}`;
                            identitasDokter.querySelector('img').src = `data:image/png;base64,${data[0].gambar}`;
        
                            // Bersihkan tabel jadwal sebelum menambahkan data baru
                            const jadwalTable = identitasDokter.querySelector('table');
                            jadwalTable.innerHTML = '<tr><th>Hari</th><th>Jam Mulai</th><th>Jam Selesai</th></tr>';
        
                            // Tambahkan baris baru untuk setiap jadwal dokter
                            data[0].JadwalDokter.forEach(jadwal => {
                                const row = document.createElement('tr');
                                row.innerHTML = `<td>${jadwal.hari_praktek}</td><td>${jadwal.jam_mulai || '-'}</td><td>${jadwal.jam_selesai || '-'}</td>`;
                                jadwalTable.appendChild(row);
                            });
        
                            // Tampilkan identitas dokter
                            identitasDokter.style.display = 'block';
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });
                });
            })
            .catch(error => console.error('Error fetching dokter:', error));
    });
});
