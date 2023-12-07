// cekreservasi.js
function cekReservasi() {
    const noRSInput = document.getElementById("NoRS");
    const noRSValue = noRSInput.value;
    const resultContainer = document.getElementById("resultContainer");
    const noDataMessage = document.getElementById("noDataMessage");

    fetch(`/reservasi/api/byNoRS/${noRSValue}`)
        .then(response => response.json())
        .then(data => {
            const resultTable = document.getElementById("resultTable");
            const resultTableBody = document.getElementById("resultTableBody");

            // Clear previous results
            resultTableBody.innerHTML = "";

            if (data.error) {
                // Handle error response
                console.error("Error response:", data.error);
                noDataMessage.style.display = "none";
                resultTable.style.display = "none";
                resultContainer.style.display = "block";
                resultContainer.innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
                // Display data
                if (data.length === 0) {
                    // No data found
                    noDataMessage.style.display = "block";
                    resultTable.style.display = "none";
                } else {
                    // Data found, display table
                    noDataMessage.style.display = "none";
                    resultTable.style.display = "table";
                    data.forEach(reservasi => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${reservasi.id_reservasi}</td>
                            <td>${reservasi.no_rs}</td>
                            <td>${reservasi.nik}</td>
                            <td>${reservasi.tgl_kunjungan}</td>
                            <td>${reservasi.nama}</td>
                            <td>${reservasi.jenis_kelamin}</td>
                            <td>${reservasi.tgl_lahir}</td>
                            <td>${reservasi.email}</td>
                            <td>${reservasi.no_telp}</td>
                            <td>${reservasi.pembayaran}</td>
                            <td>
                                <button onclick="editReservasi(${reservasi.id_reservasi})">Update</button>
                                <button onclick="deleteReservasi(${reservasi.id_reservasi})">Delete</button>
                            </td>
                        `;
                        resultTableBody.appendChild(row);
                    });
                }
                resultContainer.style.display = "block";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            noDataMessage.style.display = "none";
            resultTable.style.display = "none";
            resultContainer.style.display = "block";
            resultContainer.innerHTML = "<p>An error occurred while fetching data.</p>";
        });
}

function editReservasi(reservasiId) {
    fetch(`/reservasi/api/byID/${reservasiId}`)
    .then(response => response.json())
    .then(data => {
        // Isi formulir dengan data reservasi
        document.getElementById("NoRS").value = data.no_rs;
        document.getElementById("NIK").value = data.nik;
        document.getElementById("Nama").value = data.nama;
        document.getElementById("TglLahir").value = data.tgl_lahir;
        document.getElementById("JenisKelamin").value = data.jenis_kelamin;
        // ... isikan formulir dengan properti lainnya

        // Setelah formulir diisi, munculkan formulir atau modal edit
        // ...

    })
}

function deleteReservasi(reservasiId) {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus data?");

    if (!isConfirmed) {
        return;
    }

    fetch(`/reservasi/api/byID/${reservasiId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        cekReservasi(reservasiId);
    })
    .catch(error => {
        console.error("Error deleting data:", error);
    });
}
