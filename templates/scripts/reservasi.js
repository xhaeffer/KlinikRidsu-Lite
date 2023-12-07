document.addEventListener('DOMContentLoaded', function () {
    const poliDropdown = document.getElementById('poliDropdown');
    const dokterDropdown = document.getElementById('dokterDropdown');
    const identitasDokter = document.getElementById('doctorCard');

    // Mengambil daftar poli dari server
    fetch('/jadwal/api/getPoli')
        .then(response => response.json())
        .then(data => {
            // Mengisi dropdown Poli dengan data dari API
            data.forEach(poli => {
                const option = document.createElement('option');
                option.value = poli;
                option.textContent = poli;
                poliDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching poli:', error));

    // Event listener untuk perubahan pada dropdown "poli"
    poliDropdown.addEventListener('change', function () {
        const selectedPoli = poliDropdown.value;

        // Mengambil daftar dokter berdasarkan "poli" yang dipilih dari server
        fetch(`/jadwal/api/byPoli/${selectedPoli}`)
            .then(response => response.json())
            .then(data => {
                dokterDropdown.innerHTML = '<option value="" selected disabled>Pilih Dokter</option>';

                // Menggunakan Set untuk menyimpan nama dokter yang unik
                const uniqueDokters = new Set(data[0].JadwalDokter.map(jadwal => data[0]));

                uniqueDokters.forEach(dokter => {
                    const option = document.createElement('option');
                    option.value = dokter.nama_dokter;
                    option.textContent = dokter.nama_dokter;
                    option.dataset.dokterId = dokter.id_dokter;
                    dokterDropdown.appendChild(option);
                });

                // Setelah dokter dipilih, tampilkan identitasDokter
                dokterDropdown.addEventListener('change', function () {
                    const selectedDokter = dokterDropdown.options[dokterDropdown.selectedIndex];
                    const selectedDokterId = selectedDokter.dataset.dokterId;

                    // Ambil data jadwal dokter dari API
                    fetch(`/jadwal/api/byID/${selectedDokterId}`)
                        .then(response => response.json())
                        .then(data => {
                            identitasDokter.querySelector('h2').textContent = data[0].nama_dokter;
                            identitasDokter.querySelector('h3').textContent = `Poli: ${data[0].poli}`;
                            identitasDokter.querySelector('img').src = `data:image/png;base64,${data[0].gambar}`;
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
