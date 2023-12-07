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

            resultTableBody.innerHTML = "";

            if (data.error) {
                console.error("Error response:", data.error);
                noDataMessage.style.display = "none";
                resultTable.style.display = "none";
                resultContainer.style.display = "block";
                resultContainer.innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
                if (data.length === 0) {
                    noDataMessage.style.display = "block";
                    resultTable.style.display = "none";
                } else {
                    noDataMessage.style.display = "none";
                    resultTable.style.display = "table";
                    data.forEach(reservasi => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
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
                                <button onclick="openUpdatePopup(${reservasi.id_reservasi})">Update</button>
                                <p></p>
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

function openUpdatePopup(idReservasi) {
    fetch(`/reservasi/api/byID/${idReservasi}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("popupIdReservasi").innerText = idReservasi;
        document.getElementById("popupNoRS").innerText = data[0].no_rs;
        document.getElementById("popupNIK").value = data[0].nik;
        document.getElementById("popupTglKunjungan").value = data[0].tgl_kunjungan;
        document.getElementById("popupNama").value = data[0].nama;
        document.getElementById("popupJenisKelamin").value = data[0].jenis_kelamin;
        document.getElementById("popupTglLahir").value = data[0].tgl_lahir;
        document.getElementById("popupEmail").value = data[0].email;
        document.getElementById("popupNoTelp").value = data[0].no_telp;
        document.getElementById("popupPembayaran").value = data[0].pembayaran;

        document.getElementById("updatePopup").style.display = "flex";
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}

function submitUpdate() {
    const updatedData = {
        no_rs: parseInt(document.getElementById("popupNoRS").value),
        nik: parseInt(document.getElementById("popupNIK").value),
        tgl_kunjungan: document.getElementById("popupTglKunjungan").value,
        nama: document.getElementById("popupNama").value,
        jenis_kelamin: document.getElementById("popupJenisKelamin").value,
        tgl_lahir: document.getElementById("popupTglLahir").value,
        email: document.getElementById("popupEmail").value,
        no_telp: document.getElementById("popupNoTelp").value,
        pembayaran: document.getElementById("popupPembayaran").value,
    };

    fetch(`/reservasi/api/byID/${document.getElementById("popupIdReservasi").innerText}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
        closePopup("updatePopup");
        cekReservasi(document.getElementById("popupIdReservasi"));
        alert("Data reservasi berhasil diupdate!");
    })
    .catch(error => {
        console.error("Error updating data:", error);
        alert("Terjadi kesalahan saat melakukan update data. Silakan coba lagi.");
    });
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
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