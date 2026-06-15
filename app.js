// ==========================================
// KENDAL.IN - FRONTEND LOGIC ENGINE - V1.2
// ==========================================

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbwMepznqzjMUq_rVS9iu1JJqGJFMOQPo2_7NTV-Q2uVzLJx-oSuqNO_0S-ZWvZI0xQz_w/exec"; 

let currentUser = null;
let currentRole = 'pegawai';
let activeMenu = 'dashboard';
let transaksiUploadLogs = []; 

const MASTER_KATEGORI = [
    { id: 1, nama: "KARTU KENDALI KEPEGAWAIAN" },
    { id: 2, nama: "KARTU KENDALI KEUANGAN NEGARA DAN HIBAH" },
    { id: 3, nama: "KARTU KENDALI PENGADAAN BARANG / JASA" },
    { id: 4, nama: "KARTU KENDALI PERSEDIAAN DAN ASET" },
    { id: 5, nama: "KARTU KENDALI KELENGKAPAN ADMINISTRASI PENGELOLAAN DANA HIBAH" },
    { id: 6, nama: "KARTU KENDALI MATRIKS PROGRES TINDAK LANJUT" },
    { id: 7, nama: "KARTU KENDALI PENGADAAN LOGISTIK" },
    { id: 8, nama: "KARTU KENDALI EVALUASI KINERJA" }
];

const MASTER_RINCIAN_KARTU = [
    { id: 1, kategori_id: 1, nama: "KARTU KENDALI KEPEGAWAIAN" },
    { id: 2, kategori_id: 1, nama: "REKAP ABSENSI" },
    { id: 3, kategori_id: 1, nama: "REKAP PENILAIAN SASARAN KINERJA PEGAWAI (SKP)" },
    { id: 4, kategori_id: 1, nama: "REKAP DAFTAR URUT KEPANGKATAN/ DUK" },
    { id: 5, kategori_id: 2, nama: "KARTU KENDALI KEUANGAN NEGARA DAN HIBAH" },
    { id: 6, kategori_id: 2, nama: "LAPORAN REALISASI ANGGARAN (SAKTI)" },
    { id: 7, kategori_id: 2, nama: "BKU DAN BUKU PEMBANTU (APBN)" },
    { id: 8, kategori_id: 2, nama: "LAPORAN VERIFIKASI BUKTI PERTANGGUNGJAWABAN" },
    { id: 9, kategori_id: 2, nama: "REKAP POKJA APBN" },
    { id: 10, kategori_id: 2, nama: "REKAP PERJALANAN DINAS" },
    { id: 11, kategori_id: 2, nama: "REGISTER PENUTUPAN KAS APBN" },
    { id: 12, kategori_id: 2, nama: "REKENING KORAN APBN" },
    { id: 13, kategori_id: 2, nama: "LAPORAN REALISASI ANGGARAN /LPPA (HIBAH)" },
    { id: 14, kategori_id: 2, nama: "REGISTER PENUTUPAN KAS HIBAH" },
    { id: 15, kategori_id: 2, nama: "REKENING KORAN HIBAH" },
    { id: 16, kategori_id: 2, nama: "BKU DAN BUKU PEMBANTU (HIBAH)" },
    { id: 17, kategori_id: 2, nama: "LAPORAN VERIFIKASI BUKTI PERTANGGUNGJAWABAN HIBAH" },
    { id: 18, kategori_id: 2, nama: "LAPORAN CALK" },
    { id: 19, kategori_id: 2, nama: "LAPORAN CALBMN" },
    { id: 20, kategori_id: 3, nama: "KARTU KENDALI PENGADAAN BARANG / JASA" },
    { id: 21, kategori_id: 3, nama: "REKAPITULASI PENGADAAN BARANG / JASA APBN" },
    { id: 22, kategori_id: 3, nama: "REKAPITULASI PENGADAAN BARANG / JASA HIBAH" },
    { id: 23, kategori_id: 4, nama: "KARTU KENDALI PERSEDIAAN DAN ASET" },
    { id: 24, kategori_id: 4, nama: "LAPORAN PERSEDIAAN" },
    { id: 25, kategori_id: 4, nama: "BA STOCK OPNAME PERSEDIAAN" },
    { id: 26, kategori_id: 4, nama: "LAPORAN KONDISI BARANG MILIK NEGARA (BMN)" },
    { id: 27, kategori_id: 4, nama: "BA INVENTARISASI BMN" },
    { id: 28, kategori_id: 4, nama: "SHM KANTOR & GUDANG/BA PINJAM PAKAI KONTRAK" },
    { id: 29, kategori_id: 5, nama: "KARTU KENDALI ADMINISTRASI PENGELOLAAN DANA HIBAH" },
    { id: 30, kategori_id: 5, nama: "NPHD" },
    { id: 31, kategori_id: 5, nama: "ADDENDUM NPHD" },
    { id: 32, kategori_id: 5, nama: "REGISTER HIBAH" },
    { id: 33, kategori_id: 5, nama: "PEMBUKAAN REKENING RPDHL/RPL" },
    { id: 34, kategori_id: 5, nama: "PEMBUKAAN REKENING RPS" },
    { id: 35, kategori_id: 5, nama: "REVISI HIBAH KE DIPA" },
    { id: 36, kategori_id: 5, nama: "RENCANA KEBUTUHAN HIBAH" },
    { id: 37, kategori_id: 5, nama: "SP2HL" },
    { id: 38, kategori_id: 5, nama: "SPHL" },
    { id: 39, kategori_id: 5, nama: "SP4HL" },
    { id: 40, kategori_id: 5, nama: "SP3HL" },
    { id: 41, kategori_id: 5, nama: "BUKTI SETOR PENGEMBALIAN SISA DANA HIBAH KE NEGARA/PEMDA" },
    { id: 42, kategori_id: 6, nama: "KARTU KENDALI MATRIKS PROGRES TINDAK LANJUT" },
    { id: 43, kategori_id: 7, nama: "KARTU KENDALI KELENGKAPAN PENGADAAN LOGISTIK" },
    { id: 44, kategori_id: 8, nama: "KARTU KENDALI EVALUASI AKUNTABILITAS KINERJA PEMERINTAH" },
    { id: 45, kategori_id: 8, nama: "LHE" },
    { id: 46, kategori_id: 8, nama: "BUKTI TL HASIL EVALUASI" }
];

let MOCK_PEGAWAI = [];
let MOCK_OPERATOR = [];

// Fungsi mengambil data akun riil dari Google Sheets (doGet)
function fetchUsersFromServer() {
    if(!GAS_API_URL) return;
    
    fetch(`${GAS_API_URL}?action=get_users`)
    .then(res => res.json())
    .then(resData => {
        if(resData.status === "success") {
            MOCK_PEGAWAI = resData.pegawai;
            MOCK_OPERATOR = resData.operator;
            populateLoginDropdown();
            console.log("Data pengguna berhasil ditarik dari Google Sheets");
        }
    })
    .catch(err => console.error("Gagal menarik data pengguna:", err));
}

// Ambil data log transaksi (doPost)
function fetchRealLogsFromServer() {
    if(!GAS_API_URL) return;
    
    fetch(GAS_API_URL, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ action: "get_all_logs" }),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
    })
    .then(res => res.json())
    .then(resData => {
        if(resData.status === "success") {
            transaksiUploadLogs = resData.data;
            if(activeMenu === 'monitoring') loadMonitoringData(); 
        }
    })
    .catch(err => console.error("Gagal menarik log berkas:", err));
}

// Inisialisasi Tunggal saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    fetchUsersFromServer(); 
    fetchRealLogsFromServer(); 
    populateLoginDropdown();
    renderUserCategoryCards();
});

function setRole(role) {
    currentRole = role;
    populateLoginDropdown();
}

function populateLoginDropdown() {
    const selectEl = document.getElementById("login-name-select");
    if(!selectEl) return;
    selectEl.innerHTML = '<option value="" disabled selected>Pilih nama Anda...</option>';
    
    const list = (currentRole === 'pegawai') ? MOCK_PEGAWAI : MOCK_OPERATOR;
    list.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        // Ganti baris tersebut agar hanya menampilkan nama saja
        option.textContent = user.nama; 
        selectEl.appendChild(option);
    });
}

function handleLogin(e) {
    e.preventDefault();
    const idSelected = document.getElementById("login-name-select").value;
    const passwordIn = document.getElementById("login-password").value;

    if (!idSelected) return alert("Silakan pilih nama terlebih dahulu!");

    if (currentRole === 'pegawai') {
        if (passwordIn === "657139") { 
            currentUser = MOCK_PEGAWAI.find(p => p.id === idSelected);
            enterApp('pegawai');
        } else {
            alert("Password Sub-Bagian salah!");
        }
    } else {
        if (passwordIn === "admin657139") { 
            currentUser = MOCK_OPERATOR.find(o => o.id === idSelected);
            enterApp('operator');
        } else {
            alert("Password Operator salah!");
        }
    }
}

function enterApp(role) {
    document.getElementById("login-screen").classList.add("d-none");
    document.getElementById("main-app").classList.remove("d-none");
    
    document.getElementById("user-display-name").textContent = currentUser.nama;
    document.getElementById("user-display-role").textContent = (role === 'pegawai') ? currentUser.sub_bagian : "Operator SPIP Kantor";
    document.getElementById("user-initial").textContent = currentUser.nama.charAt(0);

    // --- LOGIKA HAK AKSES MENU (UI) ---
    const btnMonitoring = document.getElementById("menu-monitoring");
    const btnUserMgmt = document.getElementById("menu-user-management");

    if (role === 'operator') {
        if (btnMonitoring) btnMonitoring.classList.remove("d-none");
        if (btnUserMgmt) btnUserMgmt.classList.remove("d-none"); // Operator bisa kelola pengguna
        switchMenu('monitoring'); 
    } else {
        if (btnMonitoring) btnMonitoring.classList.add("d-none");
        if (btnUserMgmt) btnUserMgmt.classList.add("d-none"); // Pegawai dilarang keras melihat menu ini
        switchMenu('dashboard'); 
    }
}

function handleLogout() {
    currentUser = null;
    document.getElementById("login-password").value = "";
    
    // Sembunyikan layar utama dan bersihkan sisa animasinya
    const mainApp = document.getElementById("main-app");
    mainApp.classList.add("d-none");
    mainApp.classList.remove("slide-up-smooth");
    
    // Tampilkan kembali layar login dengan efek fade-in yang santai
    const loginScreen = document.getElementById("login-screen");
    loginScreen.classList.remove("d-none");
    loginScreen.classList.add("fade-in-smooth");
}

function switchMenu(menu) {
    // --- PROTEKSI KEAMANAN TINGKAT TINGGI ---
    if ((menu === 'monitoring' || menu === 'user-management') && currentRole !== 'operator') {
        Swal.fire({ icon: 'error', title: 'Akses Ditolak!', text: 'Area steril! Hanya Operator SPIP yang diizinkan masuk.' });
        return;
    }

    activeMenu = menu;
    
    const btnDashboard = document.getElementById("menu-dashboard");
    const btnMonitoring = document.getElementById("menu-monitoring");
    const btnUserMgmt = document.getElementById("menu-user-management");
    
    if (btnDashboard) btnDashboard.classList.remove("active");
    if (btnMonitoring) btnMonitoring.classList.remove("active");
    if (btnUserMgmt) btnUserMgmt.classList.remove("active");
    
    document.getElementById("view-user-dashboard").classList.add("d-none");
    document.getElementById("view-operator-dashboard").classList.add("d-none");
    document.getElementById("view-user-management").classList.add("d-none");

    if (menu === 'dashboard') {
        if (btnDashboard) btnDashboard.classList.add("active");
        document.getElementById("view-user-dashboard").classList.remove("d-none");
    } else if (menu === 'monitoring') {
        if (btnMonitoring) btnMonitoring.classList.add("active");
        document.getElementById("view-operator-dashboard").classList.remove("d-none");
        loadMonitoringData();
    } else if (menu === 'user-management') {
        if (btnUserMgmt) btnUserMgmt.classList.add("active");
        document.getElementById("view-user-management").classList.remove("d-none");
        loadUserManagementData(); // Panggil fungsi muat data user
    }
}

function renderUserCategoryCards() {
    const container = document.getElementById("categories-container");
    if(!container) return;
    
    // --- KUNCI UTAMA FIX LAYOUT ---
    // Kita paksa container utama menjadi block agar setiap sub-bagian 
    // otomatis membuat baris baru ke bawah (tidak dipaksa sejajar ke samping)
    container.style.display = "block";
    container.innerHTML = "";

    // 1. Struktur Pemetaan Sub-Bagian
    const dataSubBagian = [
        {
            nama: "Sub-Bagian Partisipasi, Hubungan Masyarakat, dan SDM",
            warnaAksen: "border-primary", // Biru
            badgeColor: "bg-primary-subtle text-primary",
            kategoriIds: [1]
        },
        {
            nama: "Sub-Bagian Keuangan, Umum, dan Logistik",
            warnaAksen: "border-warning", // Kuning
            badgeColor: "bg-warning-subtle text-dark",
            kategoriIds: [2, 3, 4, 5, 6, 7]
        },
        {
            nama: "Sub-Bagian Perencanaan, Data, dan Informasi",
            warnaAksen: "border-info", // Cyan/Biru Muda
            badgeColor: "bg-info-subtle text-info",
            kategoriIds: [8]
        }
    ];

    // 2. Loop setiap Sub-Bagian (Baris demi Baris)
    dataSubBagian.forEach(sub => {
        const subSectionWrapper = document.createElement("div");
        subSectionWrapper.className = "mb-5 w-100"; // w-100 memastikan memakan lebar penuh baris

        // Desain Judul Sub-Bagian dengan Garis Samping Kiri (Aksen Modern)
        let htmlContent = `
            <div class="d-flex align-items-center mb-3 border-start border-4 ${sub.warnaAksen} ps-3">
                <h5 class="fw-bold text-dark mb-0 text-uppercase tracking-wide" style="font-size: 0.9rem; letter-spacing: 0.5px;">
                    ${sub.nama}
                </h5>
                <span class="badge ${sub.badgeColor} ms-2 rounded-pill shadow-sm" style="font-size: 0.7rem; font-weight: 600;">
                    ${sub.kategoriIds.length} Kategori
                </span>
            </div>
            <div class="row g-3">
        `;

        // 3. Loop untuk mencetak Card internal di bawah Sub-Bagian terkait
        sub.kategoriIds.forEach(idCat => {
            const kat = MASTER_KATEGORI.find(k => k.id === idCat);
            if (kat) {
                const countRincian = MASTER_RINCIAN_KARTU.filter(r => r.kategori_id === kat.id).length;
                
                // Card dimasukkan ke dalam col-md-6 atau col-lg-4 agar horizontal di dalam baris sub-bagiannya
                htmlContent += `
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="category-card h-100 mb-0 shadow-sm border" onclick="openUploadModal(${kat.id})" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div class="category-icon-box mb-2"><i class="bi bi-folder2-open"></i></div>
                                <div class="category-title fw-bold text-dark lh-base" style="font-size: 0.85rem; min-height: 40px;">${kat.nama}</div>
                            </div>
                            <span class="category-badge mt-3 align-self-start">${countRincian} Komponen Berkas</span>
                        </div>
                    </div>
                `;
            }
        });

        htmlContent += `</div>`; // Tutup tag row internal berkas
        subSectionWrapper.innerHTML = htmlContent;
        container.appendChild(subSectionWrapper);
    });
}



let selectedKategoriIdGlobal = null;

// 1. Modifikasi Fungsi Buka Modal
function openUploadModal(kategoriId) {
    selectedKategoriIdGlobal = kategoriId;
    const kategoriObj = MASTER_KATEGORI.find(k => k.id === kategoriId);
    document.getElementById("modal-category-title").textContent = kategoriObj.nama;
    
    // Reset form dasar
    document.getElementById("form-status-dokumen").value = "Ada";
    document.getElementById("form-file-input").value = "";
    document.getElementById("form-catatan").value = "";
    toggleFileRequirement();

    // Panggil fungsi render list yang baru
    renderModalRincianList();

    const uploadModal = new bootstrap.Modal(document.getElementById('uploadModal'));
    uploadModal.show();
}

// 2. FUNGSI BARU: Render List Dinamis dengan Pengecekan Data
function renderModalRincianList() {
    const rincianContainer = document.getElementById("modal-rincian-list");
    if (!rincianContainer) return;
    rincianContainer.innerHTML = "";
    
    // Ambil nilai bulan dan tahun yang sedang dipilih di dalam modal
    const selectedBulan = document.getElementById("form-bulan").value;
    const selectedTahun = document.getElementById("form-tahun").value;
    
    const itemsFiltered = MASTER_RINCIAN_KARTU.filter(r => r.kategori_id === selectedKategoriIdGlobal);
    let firstAvailableId = null;

    itemsFiltered.forEach((item) => {
        // Cek apakah berkas rincian ini sudah ada di riwayat transaksi untuk bulan & tahun tersebut
        const isUploaded = transaksiUploadLogs.some(l => 
            l.id_kartu == item.id && 
            l.periode_bulan === selectedBulan && 
            l.periode_tahun == selectedTahun
        );
        
        const div = document.createElement("div");

        if (isUploaded) {
            // TAMPILAN TERKUNCI (Jika file sudah ada)
            // Menggunakan styling Gen-Z friendly (merah pudar/subtle)
            div.className = `rincian-item-box bg-light border-danger text-muted opacity-75`;
            div.style.cursor = "not-allowed";
            
            div.innerHTML = `
                <div class="d-flex align-items-center justify-content-between gap-3">
                    <div class="d-flex align-items-center gap-3">
                        <input type="radio" disabled id="radio-${item.id}">
                        <label for="radio-${item.id}" class="mb-0 fw-medium text-secondary small" style="cursor:not-allowed;">
                            <del>${item.id}. ${item.nama}</del>
                        </label>
                    </div>
                    <span class="badge bg-danger-subtle text-danger border border-danger-subtle" style="font-size:0.7rem;">
                        <i class="bi bi-lock-fill"></i> Sudah Terisi
                    </span>
                </div>
            `;
        } else {
            // TAMPILAN NORMAL (Jika file belum ada)
            if (!firstAvailableId) firstAvailableId = item.id; 
            
            div.className = `rincian-item-box ${firstAvailableId === item.id ? 'active' : ''}`;
            div.style.cursor = "pointer";
            div.id = `rincian-box-${item.id}`;
            div.onclick = () => selectRincianItemInModal(item.id);
            
            div.innerHTML = `
                <div class="d-flex align-items-center justify-content-between gap-3">
                    <div class="d-flex align-items-center gap-3">
                        <input type="radio" name="modal_rincian_radio" value="${item.id}" ${firstAvailableId === item.id ? 'checked' : ''} id="radio-${item.id}" style="accent-color: var(--accent-color);">
                        <label for="radio-${item.id}" class="mb-0 fw-medium text-dark small" style="cursor:pointer;">${item.id}. ${item.nama}</label>
                    </div>
                </div>
            `;
        }
        rincianContainer.appendChild(div);
    });
}

// 3. Perbarui fungsi Select agar mengabaikan box yang terkunci
function selectRincianItemInModal(itemId) {
    const radio = document.getElementById(`radio-${itemId}`);
    // Cegah klik jika item ini statusnya disabled/terkunci
    if(radio && radio.disabled) return; 

    document.querySelectorAll('#modal-rincian-list .rincian-item-box.active').forEach(box => box.classList.remove('active'));
    
    if(radio) radio.checked = true;
    const box = document.getElementById(`rincian-box-${itemId}`);
    if(box) box.classList.add('active');
}

function toggleFileRequirement() {
    const status = document.getElementById("form-status-dokumen").value;
    const section = document.getElementById("file-uploader-section");
    if (status === "Nihil") {
        section.style.opacity = "0.4";
        document.getElementById("form-file-input").disabled = true;
        document.getElementById("form-file-input").required = false;
    } else {
        section.style.opacity = "1";
        document.getElementById("form-file-input").disabled = false;
        document.getElementById("form-file-input").required = true;
    }
}

function submitReportForm(e) {
    e.preventDefault();
    const submitBtn = document.getElementById("btn-submit-report");
    
    const selectedRadio = document.querySelector('input[name="modal_rincian_radio"]:checked');
    if (!selectedRadio) return alert("Pilih salah satu komponen berkas!");
    
    const idKartu = selectedRadio.value;
    const rincianObj = MASTER_RINCIAN_KARTU.find(r => r.id == idKartu);
    
    // --- TAMBAHAN BARU: Mencari nama kategori berdasarkan id_kategori dari rincian ---
    const kategoriObj = MASTER_KATEGORI.find(k => k.id === rincianObj.kategori_id);
    const namaKategoriInduk = kategoriObj ? kategoriObj.nama : "Tanpa Kategori";
    // --------------------------------------------------------------------------------
    
    const bulan = document.getElementById("form-bulan").value;
    const tahun = document.getElementById("form-tahun").value;
    const status = document.getElementById("form-status-dokumen").value;
    const catatan = document.getElementById("form-catatan").value;
    const fileInput = document.getElementById("form-file-input").files[0];

    // --- TAMBAHAN SATPAM VALIDASI PDF (VERSI SWEETALERT) ---
    if (status === "Ada" && fileInput) {
        // Jika tipe file bukan PDF, tolak dan tampilkan pop-up keren!
        if (fileInput.type !== "application/pdf") {
            Swal.fire({
                icon: 'error',
                title: 'Format Ditolak!',
                text: 'Hanya dokumen berformat PDF yang diperbolehkan untuk menjaga kerapian arsip.',
                confirmButtonColor: '#0d6efd', // Warna biru khas Bootstrap
                confirmButtonText: 'Mengerti'
            });
            return; // Hentikan eksekusi
        }
    }
    // ------------------------------------   

    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim Berkas...";

    const payload = {
        action: "upload_berkas",
        id_pegawai: currentUser.id, 
        nama_pegawai: currentUser.nama,
        sub_bagian: currentUser.sub_bagian,
        jabatan: currentUser.jabatan,
        id_kartu: idKartu,
        nama_rincian_kartu: rincianObj.nama,
        
        // --- TAMBAHAN BARU: Menyisipkan nama kategori ke dalam payload ---
        nama_kategori: namaKategoriInduk,
        // -----------------------------------------------------------------
        
        periode_bulan: bulan,
        periode_tahun: tahun,
        status_laporan: status,
        catatan_tambahan: catatan,
        file_data: null,
        file_name: null
    };

    if (status === "Ada" && fileInput) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Data = event.target.result.split(',')[1];
            payload.file_data = base64Data;
            payload.file_name = `${rincianObj.nama}.${fileInput.name.split('.').pop()}`; 
            sendDataToBackend(payload);
        };
        reader.readAsDataURL(fileInput);
    } else {
        sendDataToBackend(payload);
    }
}

// function sendDataToBackend(payload) {
//     fetch(GAS_API_URL, {
//         method: "POST",
//         mode: "cors",
//         body: JSON.stringify(payload),
//         headers: { "Content-Type": "text/plain;charset=utf-8" }
//     })
//     .then(res => res.json())
//     .then(data => {
//         if(data.status === "success") {
//             alert("Sukses! Berkas berhasil disimpan dan disinkronkan ke dalam spreadsheet & Google Drive.");
//             finalizeFormSubmit();
//             fetchRealLogsFromServer(); 
//         } else {
//             alert("Error Backend: " + data.message);
//             resetSubmitBtn();
//         }
//     })
//     .catch(err => {
//         console.error(err);
//         alert("Gagal terhubung dengan backend Apps Script.");
//         resetSubmitBtn();
//     });
// }

function sendDataToBackend(payload) {
    fetch(GAS_API_URL, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success") {
            
            // --- LETAKKAN SWEETALERT SUCCESS DI SINI ---
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Berkas berhasil disimpan dan disinkronkan ke Google Drive.',
                confirmButtonColor: '#198754', 
                timer: 2500, 
                showConfirmButton: false 
            });
            // -------------------------------------------
            
            finalizeFormSubmit();
            fetchRealLogsFromServer(); 
        } else {
            
            // --- SWEETALERT UNTUK ERROR BACKEND ---
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: "Error Backend: " + data.message,
                confirmButtonColor: '#dc3545'
            });
            // --------------------------------------
            
            resetSubmitBtn();
        }
    })
    .catch(err => {
        console.error(err);
        
        // --- SWEETALERT UNTUK ERROR JARINGAN ---
        Swal.fire({
            icon: 'error',
            title: 'Koneksi Terputus',
            text: 'Gagal terhubung dengan server Apps Script. Silakan periksa jaringan Anda.',
            confirmButtonColor: '#dc3545'
        });
        // ---------------------------------------
        
        resetSubmitBtn();
    });
}

function finalizeFormSubmit() {
    resetSubmitBtn();
    const myModalEl = document.getElementById('uploadModal');
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
}

function resetSubmitBtn() {
    const submitBtn = document.getElementById("btn-submit-report");
    if(submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Kirim Laporan Berkas";
    }
}

function loadMonitoringData() {
    const filteredBulan = document.getElementById("filter-bulan").value;
    const filteredTahun = document.getElementById("filter-tahun").value;
    const tbody = document.getElementById("monitoring-table-body");
    if(!tbody) return;
    tbody.innerHTML = "";

    MASTER_RINCIAN_KARTU.forEach((item) => {
        const matchLog = transaksiUploadLogs.find(l => 
            l.id_kartu == item.id && 
            l.periode_bulan === filteredBulan && 
            l.periode_tahun == filteredTahun
        );

        const row = document.createElement("tr");

        let cellSubBagian = matchLog ? matchLog.sub_bagian : "-";
        let cellPenanggungJawab = matchLog ? `<div><strong>${matchLog.nama_pegawai}</strong></div><div class="text-secondary" style="font-size:0.75rem;">${matchLog.jabatan}</div>` : "-";
        
        let cellStatusDoc = `<span class="badge-modern badge-belum">Belum Ada</span>`;
        if (matchLog) {
            if (matchLog.status_laporan === "Ada") {
                cellStatusDoc = `<span class="badge-modern badge-ada">Ada</span>`;
            } else {
                cellStatusDoc = `<span class="badge-modern badge-nihil">Nihil</span>`;
            }
        }

        let cellVerifikasi = "-";
        let cellAksi = "-";

        if (matchLog) {
            let badgeAccClass = "badge-acc-pending";
            if (matchLog.status_acc === "Disetujui") badgeAccClass = "badge-acc-approved";
            if (matchLog.status_acc === "Perlu Revisi") badgeAccClass = "badge-acc-revisi";

            cellVerifikasi = `<span class="badge-modern ${badgeAccClass}">${matchLog.status_acc}</span>`;
            
// 1. Cek apakah dokumen ini memiliki catatan dari pengunggah
const hasCatatan = matchLog.catatan_tambahan && matchLog.catatan_tambahan.trim() !== "" && matchLog.catatan_tambahan.trim() !== "-";

// 2. Siapkan wadah untuk elemen HTML Tombol Mata
let btnMataHtml = '';

// 3. Rancang tombol mata berdasarkan status laporan dan keberadaan catatan
if (matchLog.status_laporan === 'Ada') {
    if (hasCatatan) {
        // Tombol Mata DENGAN Notifikasi Merah (!)
        btnMataHtml = `
            <button onclick="bukaBerkasDariLog('${matchLog.id_upload}')" class="btn btn-sm btn-light border position-relative" title="Ada Catatan! Buka File">
                <i class="bi bi-eye text-primary"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.55rem; padding: 0.25em 0.4em; border: 1.5px solid white;">
                    !
                </span>
            </button>
        `;
    } else {
        // Tombol Mata BIASA
        btnMataHtml = `
            <button onclick="bukaBerkasDariLog('${matchLog.id_upload}')" class="btn btn-sm btn-light border" title="Buka File">
                <i class="bi bi-eye text-primary"></i>
            </button>
        `;
    }
}

// 4. Masukkan btnMataHtml ke dalam kerangka cellAksi utama
cellAksi = `
    <div class="d-flex justify-content-center gap-1">
        
        ${btnMataHtml}
        
        ${matchLog.status_acc !== 'Disetujui' ? `
        <button class="btn btn-sm btn-light border" onclick="updateAccStatus('${matchLog.id_upload}', 'Disetujui')" title="Setujui">
            <i class="bi bi-check-lg text-success"></i>
        </button>
        ` : ''}

        <button class="btn btn-sm btn-light border" onclick="konfirmasiHapus('${matchLog.id_upload}')" title="Hapus Berkas">
            <i class="bi bi-trash text-danger"></i>
        </button>
    </div>
`;

        }

        row.innerHTML = `
            <td class="text-secondary fw-medium">${item.id}</td>
            <td>
                <div class="fw-semibold text-dark mb-0">${item.nama}</div>
                <div class="text-muted" style="font-size: 0.75rem;">${MASTER_KATEGORI.find(k => k.id === item.kategori_id).nama}</div>
            </td>
            <td>${cellSubBagian}</td>
            <td>${cellStatusDoc}</td>
            <td>${cellPenanggungJawab}</td>
            <td>${cellVerifikasi}</td>
            <td>${cellAksi}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * FUNGSI UNTUK MEMBUKA BERKAS DENGAN PENGECEKAN CATATAN
 */
function bukaBerkasDariLog(idUpload) {
    // 1. Cari data log di memori frontend berdasarkan ID Upload yang diklik
    const logData = transaksiUploadLogs.find(log => log.id_upload === idUpload);
    
    if (!logData) return; // Jaga-jaga jika data tidak ditemukan

    const link = logData.link_google_drive;
    const catatan = logData.catatan_tambahan;

    // 2. Pengecekan: Apakah ada catatan? (Tidak kosong dan bukan sekadar strip "-")
    if (catatan && catatan.trim() !== "" && catatan.trim() !== "-") {
        
        // Jika ADA catatan, munculkan pop-up SweetAlert!
        Swal.fire({
            title: 'Catatan Pengunggah',
            text: catatan,
            icon: 'info',
            confirmButtonColor: '#0d6efd', // Biru primary
            confirmButtonText: '<i class="bi bi-box-arrow-up-right me-1"></i> Buka File'
        }).then((result) => {
            // Jika admin mengeklik tombol "Buka File" di dalam pop-up
            if (result.isConfirmed) {
                window.open(link, '_blank'); // Buka link Drive di tab baru
            }
        });

    } else {
        // 3. Jika TIDAK ADA catatan, langsung buka file tanpa basa-basi
        window.open(link, '_blank');
    }
}

function updateAccStatus(idUpload, newStatus) {
    fetch(GAS_API_URL, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ action: "update_status_acc", id_upload: idUpload, status_acc: newStatus }),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success") {
            alert(`Sukses! Status transaksi ${idUpload} diubah menjadi: ${newStatus}`);
            fetchRealLogsFromServer(); 
        }
    });
}



function exportExcelReport() {
    const bulan = document.getElementById("filter-bulan").value;
    const tahun = document.getElementById("filter-tahun").value;
    alert(`Mengotomatisasi pengisian matriks excel SPIP Periode ${bulan} ${tahun}. Data akan otomatis terunduh dalam format Excel terisi penuh!`);
}


// FUNGSI TOGGLE SIDEBAR
function toggleSidebar() {
    // Sesuaikan ID "sidebar-utama" dengan ID elemen sidebar di HTML Peserta
    const sidebar = document.getElementById("sidebar-utama"); 
    
    if (sidebar) {
        sidebar.classList.toggle("sidebar-hidden");
    } else {
        console.warn("Elemen sidebar tidak ditemukan. Pastikan ID-nya sesuai.");
    }
}

// FUNGSI PENCARIAN TABEL MONITORING
function filterMonitoringTable() {
    const input = document.getElementById('search-monitoring');
    if (!input) return; // Hentikan jika input tidak ditemukan

    const filter = input.value.toLowerCase();
    const tbody = document.getElementById('monitoring-table-body');
    if (!tbody) return; // Hentikan jika tabel belum ada isinya

    const rows = tbody.getElementsByTagName('tr');

    // Loop untuk mengecek setiap baris di tabel
    for (let i = 0; i < rows.length; i++) {
        // Ambil semua teks yang ada di dalam satu baris (Komponen, Sub-Bagian, Status, dll)
        const rowText = rows[i].textContent || rows[i].innerText;
        
        // Cocokkan teks baris dengan kata kunci yang diketik
        if (rowText.toLowerCase().indexOf(filter) > -1) {
            rows[i].style.display = ""; // Munculkan jika cocok
        } else {
            rows[i].style.display = "none"; // Sembunyikan jika tidak cocok
        }
    }
}




/**
 * FUNGSI FRONTEND UNTUK KONFIRMASI DAN PROSES HAPUS BERKAS (VERSI FETCH API)
 */
function konfirmasiHapus(idUpload) {
  const konfirmasi = confirm("Apakah Peserta yakin ingin menghapus data laporan beserta file fisiknya di Google Drive?");
  
  if (konfirmasi) {
    console.log("Memulai proses penghapusan untuk ID: " + idUpload);
    
    // MANGGIL CONST GAS_API_URL DI SINI
    const scriptURL = GAS_API_URL; 
    
    // Membuat payload data yang akan dikirim ke server
    const payload = {
      action: "hapusBerkas",
      id_upload: idUpload
    };

    // Menggunakan fetch untuk menembak backend Code.gs
    fetch(scriptURL, {
      method: "POST", // Sebaiknya POST agar aman
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        alert("Sukses! Data dan file berhasil dihapus dari server.");
        
        // Tarik data terbaru dari server. 
        // Fungsi ini akan otomatis memanggil loadMonitoringData() setelah data berhasil didapat.
        if (typeof fetchRealLogsFromServer === "function") {
            fetchRealLogsFromServer();
        }
      }
    })
    .catch(error => {
      alert("Terjadi kesalahan jaringan atau server: " + error.message);
    });
  }
}


// =================================================================
// ENGINE MANAGEMENT USER (FRONTEND CONTROLLER)
// =================================================================
let listUsersAdminGlobal = [];

function loadUserManagementData() {
    const tbody = document.getElementById("user-table-body");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-secondary"><div class="spinner-border spinner-border-sm me-2"></div>Sinkronisasi basis data user...</td></tr>`;

    fetch(GAS_API_URL, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ action: "get_users_admin" }),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
    })
    .then(res => res.json())
    .then(resData => {
        if (resData.status === "success") {
            listUsersAdminGlobal = resData.data;
            renderUserManagementTable(listUsersAdminGlobal);
        }
    })
    .catch(err => {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">Gagal memuat database pengguna dari cloud server.</td></tr>`;
    });
}

function renderUserManagementTable(users) {
    const tbody = document.getElementById("user-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    if(users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">Tidak ada data pengguna ditemukan.</td></tr>`;
        return;
    }

    users.forEach(user => {
        const row = document.createElement("tr");
        const badgeRole = user.role === "Admin" ? '<span class="badge bg-dark rounded-2 small">Admin/Operator</span>' : '<span class="badge bg-secondary rounded-2 small">User/Pegawai</span>';
        const subJabatanText = user.role === "Admin" ? `<strong>${user.jabatan}</strong>` : `<div><strong>${user.sub_bagian}</strong></div><div class="text-secondary small" style="font-size:0.75rem;">${user.jabatan}</div>`;

        row.innerHTML = `
            <td class="text-secondary fw-semibold">${user.id}</td>
            <td class="fw-bold text-dark">${user.nama}</td>
            <td>${badgeRole}</td>
            <td>${subJabatanText}</td>
            <td><code class="px-2 py-1 bg-light rounded text-indigo fw-bold">${user.password}</code></td>
            <td>
                <div class="d-flex justify-content-center gap-1">
                    <button class="btn btn-sm btn-light border" onclick="openUserModal('edit', '${user.id}')" title="Edit Akun"><i class="bi bi-pencil-square text-primary"></i></button>
                    <button class="btn btn-sm btn-light border" onclick="deleteUserAdmin('${user.id}', '${user.role}')" title="Hapus Permanen"><i class="bi bi-trash-fill text-danger"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function toggleRoleFields() {
    const role = document.getElementById("user-form-role").value;
    const extraFields = document.getElementById("user-fields-pegawai");
    if (role === "Admin") {
        extraFields.classList.add("d-none");
        document.getElementById("user-form-sub").required = false;
    } else {
        extraFields.classList.remove("d-none");
        document.getElementById("user-form-sub").required = true;
    }
}

function openUserModal(mode, userId = null) {
    document.getElementById("userForm").reset();
    document.getElementById("user-form-mode").value = mode;
    
    const roleSelect = document.getElementById("user-form-role");
    roleSelect.disabled = false;

    if (mode === 'add') {
        document.getElementById("userModalTitle").textContent = "Tambah Akun Baru";
        document.getElementById("user-form-id").value = "";
        toggleRoleFields();
    } else {
        document.getElementById("userModalTitle").textContent = "Perbarui Data Akun";
        const selectedUser = listUsersAdminGlobal.find(u => u.id.toString() === userId.toString());
        if (!selectedUser) return;

        document.getElementById("user-form-id").value = selectedUser.id;
        roleSelect.value = selectedUser.role;
        roleSelect.disabled = true; // Kunci role saat edit demi keamanan struktur DB
        document.getElementById("user-form-nama").value = selectedUser.nama;
        document.getElementById("user-form-password").value = selectedUser.password;
        
        if (selectedUser.role === "User") {
            document.getElementById("user-form-sub").value = selectedUser.sub_bagian;
            document.getElementById("user-form-jabatan").value = selectedUser.jabatan;
        }
        toggleRoleFields();
    }
    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    userModal.show();
}

function submitUserForm(e) {
    e.preventDefault();
    const btnSubmit = document.getElementById("btn-submit-user");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Menyimpan Ke Cloud...";

    const mode = document.getElementById("user-form-mode").value;
    const payload = {
        action: mode === 'add' ? 'add_user' : 'edit_user',
        id: document.getElementById("user-form-id").value,
        role: document.getElementById("user-form-role").value,
        nama: document.getElementById("user-form-nama").value,
        password: document.getElementById("user-form-password").value,
        sub_bagian: document.getElementById("user-form-sub").value,
        jabatan: document.getElementById("user-form-jabatan").value || "Staf Teknis"
    };

    fetch(GAS_API_URL, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: data.message, timer: 2000, showConfirmButton: false });
            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
            loadUserManagementData(); // Refresh tabel
            if(typeof fetchUsersFromServer === "function") fetchUsersFromServer(); // Refresh drop-down login
        } else {
            Swal.fire({ icon: 'error', title: 'Gagal', text: data.message });
        }
    })
    .catch(err => Swal.fire({ icon: 'error', title: 'Error Jaringan', text: err.toString() }))
    .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Simpan Kredensial";
    });
}

function deleteUserAdmin(userId, role) {
    Swal.fire({
        title: 'Apakah Peserta Yakin?',
        text: `Akun dengan ID ${userId} akan dihapus secara permanen dari database Google Sheets!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus Akun!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(GAS_API_URL, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({ action: "delete_user", id: userId, role: role }),
                headers: { "Content-Type": "text/plain;charset=utf-8" }
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    Swal.fire({ icon: 'success', title: 'Terhapus!', text: data.message, timer: 1500, showConfirmButton: false });
                    loadUserManagementData();
                    if(typeof fetchUsersFromServer === "function") fetchUsersFromServer();
                } else {
                    Swal.fire({ icon: 'error', title: 'Gagal', text: data.message });
                }
            });
        }
    });
}

function filterUserTable() {
    const filter = document.getElementById('search-user').value.toLowerCase();
    const rows = document.getElementById('user-table-body').getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const text = rows[i].textContent || rows[i].innerText;
        rows[i].style.display = text.toLowerCase().indexOf(filter) > -1 ? "" : "none";
    }
}
