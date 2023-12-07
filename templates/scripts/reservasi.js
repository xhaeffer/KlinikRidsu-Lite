function submitReservasi() {
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

    fetch('/reservasi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        alert("Reservasi Berhasil!");
    })
    .catch(error => {
        console.error('Error submitting reservation:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const poliDropdown = document.getElementById('poliDropdown');
    const dokterDropdown = document.getElementById('dokterDropdown');
    const identitasDokter = document.getElementById('doctorCard');

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

    poliDropdown.addEventListener('change', function () {
        const selectedPoli = poliDropdown.value;

        fetch(`/jadwal/api/byPoli/${selectedPoli}`)
            .then(response => response.json())
            .then(data => {
                dokterDropdown.innerHTML = '<option value="" selected disabled>Pilih Dokter</option>';

                const uniqueDokters = new Set(data[0].JadwalDokter.map(jadwal => data[0]));

                uniqueDokters.forEach(dokter => {
                    const option = document.createElement('option');
                    option.value = dokter.nama_dokter;
                    option.textContent = dokter.nama_dokter;
                    option.dataset.dokterId = dokter.id_dokter;
                    dokterDropdown.appendChild(option);
                });

                dokterDropdown.addEventListener('change', function () {
                    const selectedDokter = dokterDropdown.options[dokterDropdown.selectedIndex];
                    const selectedDokterId = selectedDokter.dataset.dokterId;

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
