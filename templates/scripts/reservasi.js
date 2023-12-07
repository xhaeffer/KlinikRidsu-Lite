document.addEventListener('DOMContentLoaded', function () {
    const poliDropdown = document.getElementById('poliDropdown');
    const dokterDropdown = document.getElementById('dokterDropdown');
    const tanggalKunjungan = document.getElementById('tanggalKunjungan');
    const identitasDokter = document.getElementById('doctorCard');

    let jadwalDokter;

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

                // Setelah dokter dipilih, atur batas tanggal kunjungan
                dokterDropdown.addEventListener('change', function () {
                    const selectedDokter = dokterDropdown.options[dokterDropdown.selectedIndex];
                    const selectedDokterId = selectedDokter.dataset.dokterId;

                    // Ambil data jadwal dokter dari API
                    fetch(`/jadwal/api/byID/${selectedDokterId}`)
                        .then(response => response.json())
                        .then(data => {                            
                            const jadwalKerja = data[0].JadwalDokter;
                            const hariKerja = jadwalKerja.map(jadwal => jadwal.hari);
                            const hariIndex = {
                                'Minggu': 0,
                                'Senin': 1,
                                'Selasa': 2,
                                'Rabu': 3,
                                'Kamis': 4,
                                'Jumat': 5,
                                'Sabtu': 6,
                            };
                            identitasDokter.querySelector('h2').textContent = data[0].nama_dokter;
                            identitasDokter.querySelector('h3').textContent = `Poli: ${data[0].poli}`;
                            identitasDokter.querySelector('img').src = `data:image/png;base64,${data[0].gambar}`;
        
                            // Bersihkan tabel jadwal sebelum menambahkan data baru
                            const jadwalTable = identitasDokter.querySelector('table');
                            jadwalTable.innerHTML = '<tr><th>Hari</th><th>Jam Mulai</th><th>Jam Selesai</th></tr>';
        
                            // Tambahkan baris baru untuk setiap jadwal dokter
                            data[0].JadwalDokter.forEach(jadwal => {
                                const row = document.createElement('tr');
                                row.innerHTML = `<td>${jadwal.hari}</td><td>${jadwal.jam_mulai || '-'}</td><td>${jadwal.jam_selesai || '-'}</td>`;
                                jadwalTable.appendChild(row);
                            });
        
                            // Tampilkan identitasDokter
                            identitasDokter.style.display = 'block';

                            const indeksAwal = hariIndex[hariKerja[0]];
                            const indeksAkhir = hariIndex[hariKerja[hariKerja.length - 1]];                            

                            console.log('Indeks Awal:', indeksAwal);
                            console.log('Indeks Akhir:', indeksAkhir);
                            
                            const tanggalAwal = new Date();
                            tanggalAwal.setDate(tanggalAwal.getDate() + (indeksAwal - tanggalAwal.getDay() + 7) % 7);

                            const tanggalAkhir = new Date(tanggalAwal);
                            tanggalAkhir.setDate(tanggalAwal.getDate() + 30);

                            if (!isNaN(tanggalAwal) && !isNaN(tanggalAkhir)) {
                                tanggalKunjungan.min = tanggalAwal.toISOString().split('T')[0];
                                tanggalKunjungan.max = tanggalAkhir.toISOString().split('T')[0];
                            } else {
                                console.error('Invalid date values received from the server:', hariKerja);
                            }

                            // Event listener untuk perubahan pada tanggal kunjungan
                            tanggalKunjungan.addEventListener('input', function () {
                                console.log('Selected Date in Event Listener:', tanggalKunjungan.value);
                                const selectedDate = new Date(tanggalKunjungan.value);
                                console.log('Selected Date Object:', selectedDate);
                                const dayOfWeek = selectedDate.toLocaleDateString('id-ID', { weekday: 'long' });
                                const isHariValid = isHariKerja(selectedDate, selectedDokterId, jadwalKerja);
                            
                                console.log('isHariValid:', isHariValid);
                            
                                if (!selectedPoli || !selectedDokter) {
                                    alert('Silakan pilih Poli dan Dokter terlebih dahulu.');
                                    tanggalKunjungan.value = '';
                                } else if (!isHariValid) {
                                    alert(`Dokter tidak praktek pada hari ${dayOfWeek}. Silakan pilih tanggal lain.`);
                                    tanggalKunjungan.value = '';
                                }
                            });
                        })

                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });
                });       

                function isHariKerja(tanggal, dokterId, jadwalDokter) {
                    if (jadwalDokter) {
                        const jadwalKerja = jadwalDokter.filter(jadwal => jadwal.id_dokter == dokterId);
                        const hariKerja = jadwalKerja.map(jadwal => ({
                            hari: jadwal.hari.toLowerCase(),
                            jamMasuk: jadwal.jam_mulai,
                            jamKeluar: jadwal.jam_selesai,
                        }));
                
                        const selectedDay = tanggal.toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase();
                        const selectedDaySchedule = hariKerja.find(jadwal => jadwal.hari === selectedDay);
                
                        if (selectedDaySchedule) {
                            const today = new Date();
                            const selectedDate = new Date(tanggal);
                            
                            // Ubah ini
                            const relativeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + getRelativeDate(selectedDaySchedule, selectedDay));
                
                            return (
                                selectedDate >= relativeDate &&
                                selectedDaySchedule.jamMasuk !== '' &&
                                selectedDaySchedule.jamKeluar !== ''
                            );
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                function getRelativeDate(selectedDaySchedule, selectedDay) {
                    const hariIndex = {
                        'minggu': 0,
                        'senin': 1,
                        'selasa': 2,
                        'rabu': 3,
                        'kamis': 4,
                        'jumat': 5,
                        'sabtu': 6,
                    };
                
                    const hariPraktekIndex = hariIndex[selectedDaySchedule.hari];
                    const selectedDayIndex = hariIndex[selectedDay];
                
                    return (selectedDayIndex - hariPraktekIndex + 7) % 7;
                }
                
                function getEndDate(selectedDate, dokterId, jadwalKerja) {
                    const selectedDay = selectedDate.toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase();
                    const selectedDaySchedule = jadwalKerja.find(jadwal => jadwal.hari === selectedDay);
                
                    if (selectedDaySchedule) {
                        const today = new Date();
                        const relativeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + getRelativeDate(selectedDaySchedule, selectedDay));
                        const endDate = new Date(relativeDate);
                        endDate.setHours(selectedDaySchedule.jamKeluar.split(':')[0]);
                        endDate.setMinutes(selectedDaySchedule.jamKeluar.split(':')[1]);
                
                        return endDate;
                    } else {
                        return selectedDate;
                    }
                }
            })
            .catch(error => console.error('Error fetching dokter:', error));
    });

});
