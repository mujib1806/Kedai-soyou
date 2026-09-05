
    // 1. KONEKSI FIREBASE
    const firebaseConfig = {
        apiKey: "AIzaSyB2H9QoCwaZOYn7K1UyLeCOOu8Byvs61Bg",
        authDomain: "kedaisoyou.firebaseapp.com",
        databaseURL: "https://kedaisoyou-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "kedaisoyou",
        storageBucket: "kedaisoyou.firebasestorage.app",
        messagingSenderId: "1057238530589",
        appId: "1:1057238530589:web:d358014f5f685c4c4ce4f4",
        measurementId: "G-05C04VXK2N"
    };

    if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
    const db = firebase.firestore();

    // 2. DATA MASTER DEFAULT
    const defaultMasterProduk = [
        { nama: "Teh Sosro", kemasan: "Botol Beling", varian: "Original", modal: 2000, jual: 5000, margin: 3000, minStok: 5 },
        { nama: "Teh Sosro", kemasan: "Kotak / Plastik", varian: "Original", modal: 2500, jual: 5000, margin: 2500, minStok: 5 },
        { nama: "Teh Sosro", kemasan: "Kotak / Plastik", varian: "Less Sugar", modal: 2500, jual: 5000, margin: 2500, minStok: 5 },
        { nama: "Fruit Tea", kemasan: "Botol Beling", varian: "Blackcurrent", modal: 2000, jual: 5000, margin: 3000, minStok: 5 },
        { nama: "Fruit Tea", kemasan: "Kotak / Plastik", varian: "Lemon", modal: 2500, jual: 5000, margin: 2500, minStok: 5 },
        { nama: "Fruit Tea", kemasan: "Kotak / Plastik", varian: "Blackcurrent", modal: 2500, jual: 5000, margin: 2500, minStok: 5 },
        { nama: "Fruit Tea", kemasan: "Kotak / Plastik", varian: "Apel", modal: 2500, jual: 5000, margin: 2500, minStok: 5 },
        { nama: "Country Choice", kemasan: "Kotak / Plastik", varian: "Mangga", modal: 4500, jual: 8000, margin: 3500, minStok: 5 },
        { nama: "Country Choice", kemasan: "Kotak / Plastik", varian: "Jeruk", modal: 4500, jual: 8000, margin: 3500, minStok: 5 },
        { nama: "Country Choice", kemasan: "Kotak / Plastik", varian: "Jambu", modal: 4500, jual: 8000, margin: 3500, minStok: 5 },
        { nama: "Country Choice", kemasan: "Kotak / Plastik", varian: "Apel", modal: 4500, jual: 8000, margin: 3500, minStok: 5 },
        { nama: "Air Mineral", kemasan: "Botol / Cup", varian: "Original", modal: 1600, jual: 4000, margin: 2400, minStok: 5 },
        { nama: "Tebs", kemasan: "Botol Beling", varian: "Original", modal: 2200, jual: 5000, margin: 2800, minStok: 5 }
    ];
    
    const defaultMasterVendor = [
        { nama: "Prima Mineral", kemasan: "Botol Pelastik", vol: "600 Ml", isi: 24, rasa: "Original", harga: 38000 },
        { nama: "Teh Botol Sosro", kemasan: "Botol Beling", vol: "220 Ml", isi: 24, rasa: "Original", harga: 48000 },
        { nama: "Teh Botol Sosro", kemasan: "Carton Pack", vol: "250 Ml", isi: 24, rasa: "Original", harga: 60000 },
        { nama: "Teh Botol Sosro", kemasan: "Carton Pack", vol: "250 Ml", isi: 24, rasa: "Less Sugar", harga: 60000 },
        { nama: "Fruit Tea", kemasan: "Botol Beling", vol: "235 Ml", isi: 24, rasa: "Blackcurrent", harga: 48000 },
        { nama: "Fruit Tea", kemasan: "Carton Pack", vol: "250 Ml", isi: 24, rasa: "Lemon", harga: 60000 },
        { nama: "Fruit Tea", kemasan: "Carton Pack", vol: "250 Ml", isi: 24, rasa: "Blackcurrent", harga: 60000 },
        { nama: "Fruit Tea", kemasan: "Carton Pack", vol: "250 Ml", isi: 24, rasa: "Apel", harga: 60000 },
        { nama: "Country Choice", kemasan: "Carton Pack", vol: "250 Ml", isi: 24, rasa: "Mangga", harga: 105000 },
        { nama: "Country Choice", kemasan: "Carton Pack", vol: "250 Ml", isi: 24, rasa: "Jeruk", harga: 105000 },
        { nama: "Country Choice", kemasan: "Carton Pack", vol: "250 Ml", isi: 24, rasa: "Jambu", harga: 105000 },
        { nama: "Country Choice", kemasan: "Carton Pack", vol: "250 Ml", isi: 24, rasa: "Apel", harga: 105000 },
        { nama: "Tebs", kemasan: "Botol Beling", vol: "230 Ml", isi: 24, rasa: "Original", harga: 51000 },
        { nama: "Tebs", kemasan: "Kaleng", vol: "330 Ml", isi: 20, rasa: "Original", harga: 85000 },
        { nama: "Tebs", kemasan: "Botol Pelastik", vol: "300 Ml", isi: 12, rasa: "Zero Lychee", harga: 45000 },
        { nama: "Tebs", kemasan: "Botol Pelastik", vol: "300 Ml", isi: 12, rasa: "Mix Fruit", harga: 45000 },
        { nama: "Tebs", kemasan: "Botol Pelastik", vol: "300 Ml", isi: 12, rasa: "Lemon Lime", harga: 45000 }
    ];

    let masterProduk = defaultMasterProduk;
    let masterVendor = defaultMasterVendor;
    let dbStok = {}, dbKasMasuk = {}, dbLogKas = [], dbStatusKunci = {};
    let activeKasTab = 'Modal Belanja';
    let currentUser = null;
    let listAkunKasir = [];
    let hasAlertedTgl = "";
    
    let chartTren = null;
    let dataCacheLaporan = null;

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    function updateOnlineStatus() {
        const statusText = document.getElementById('statusSyncText');
        if (navigator.onLine) {
            statusText.innerHTML = '🟢 ONLINE'; statusText.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)'; showToast('🌐 Koneksi internet kembali!');
        } else {
            statusText.innerHTML = '🔴 OFFLINE'; statusText.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)'; showToast('⚠️ Koneksi terputus! Cek internet Anda.');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateOnlineStatus(); 
        const savedUser = localStorage.getItem('baksoUser');
        if (savedUser) { currentUser = JSON.parse(savedUser); bukaLayarAplikasi(); } 
        else { document.getElementById('loginScreen').style.display = 'flex'; document.getElementById('appScreen').style.display = 'none'; }
        if(db) cekDanBuatAkunMaster();
    });

    function showToast(message) { const toast = document.getElementById('toastNotif'); toast.innerHTML = message || '✅ Tersimpan!'; toast.classList.add('show'); setTimeout(() => { toast.classList.remove('show'); }, 2000); }
    function cekDanBuatAkunMaster() { db.collection('users').get().then(snap => { if (snap.empty) { db.collection('users').doc('08111111111').set({ nama: 'Owner (Master)', hp: '08111111111', password: 'owner123', role: 'owner' }); } }); }
    
    function prosesLogin(e) { 
        e.preventDefault(); 
        const hp = document.getElementById('inLoginHp').value; const pass = document.getElementById('inLoginPass').value; const btn = document.getElementById('btnLoginBtn'); 
        if(!db) { alert("Tidak ada koneksi ke database!"); return; } 
        btn.innerText = "MEMERIKSA..."; btn.disabled = true; 
        db.collection('users').doc(hp).get().then(doc => { 
            if (doc.exists && doc.data().password === pass) { currentUser = doc.data(); localStorage.setItem('baksoUser', JSON.stringify(currentUser)); bukaLayarAplikasi(); } 
            else { alert("Gagal Masuk! Nomor HP atau Password salah."); } 
            btn.innerText = "MASUK"; btn.disabled = false; 
        }).catch(err => { alert("Error: " + err.message); btn.innerText = "MASUK"; btn.disabled = false; }); 
    }
    
    function bukaLayarAplikasi() { 
        document.getElementById('loginScreen').style.display = 'none'; document.getElementById('appScreen').style.display = 'block'; document.getElementById('namaUserAktif').innerText = currentUser.nama; 
        const isOwner = currentUser.role === 'owner'; document.getElementById('roleUserAktif').innerText = isOwner ? '👑 OWNER' : '🧑‍🍳 KASIR'; 
        
        document.getElementById('menuDashboard').style.display = isOwner ? 'block' : 'none'; document.getElementById('menuOrderVendor').style.display = isOwner ? 'block' : 'none'; document.getElementById('menuProduk').style.display = 'block'; 
        const grupDompet = document.getElementById('grupDompet'); if(grupDompet) grupDompet.style.display = isOwner ? 'block' : 'none';
        const grupLaporan = document.getElementById('grupLaporan'); if(grupLaporan) grupLaporan.style.display = isOwner ? 'block' : 'none';
        document.getElementById('cardAlokasiHarian').style.display = isOwner ? 'block' : 'none'; 
        
        document.getElementById('viewHarian').style.display = 'block'; document.getElementById('viewOrderVendor').style.display = 'none'; document.getElementById('viewRekapTransfer').style.display = 'none'; document.getElementById('viewMutasiKas').style.display = 'none'; document.getElementById('viewDashboard').style.display = 'none'; document.getElementById('viewMasterProduk').style.display = 'none'; 
        if(document.getElementById('viewLaporanBaru')) document.getElementById('viewLaporanBaru').style.display = 'none';

        if (isOwner) { document.getElementById('viewDashboard').style.display = 'block'; document.getElementById('viewHarian').style.display = 'none'; } 

        const today = new Date(); document.getElementById('tglOps').valueAsDate = today; 
        if(document.getElementById('lapTglAwal')) document.getElementById('lapTglAwal').valueAsDate = today; 
        if(document.getElementById('lapTglAkhir')) document.getElementById('lapTglAkhir').valueAsDate = today; 
        if(document.getElementById('lapBulanPick')) document.getElementById('lapBulanPick').value = today.toISOString().slice(0, 7); 
        
        try { inisiatisasiRealtimeListener(); } catch(e) { loadDataTanggalLocal(); } 
    }
    
    function prosesLogout() { if(confirm("Keluar dari aplikasi?")) { localStorage.removeItem('baksoUser'); currentUser = null; window.location.reload(); } }
    function toggleDropdown(btn) { btn.classList.toggle("active"); let icon = btn.querySelector("span"); if (btn.classList.contains("active")) { icon.innerText = "▲"; } else { icon.innerText = "▼"; } }
    function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); document.getElementById('overlay').classList.toggle('active'); }

    function pilihMenuNav(jenis) { 
        toggleSidebar(); 
        document.getElementById('viewHarian').style.display = 'none'; document.getElementById('viewOrderVendor').style.display = 'none'; document.getElementById('viewRekapTransfer').style.display = 'none'; document.getElementById('viewMutasiKas').style.display = 'none'; document.getElementById('viewDashboard').style.display = 'none'; document.getElementById('viewMasterProduk').style.display = 'none'; if(document.getElementById('viewLaporanBaru')) document.getElementById('viewLaporanBaru').style.display = 'none';
        
        if (jenis === 'harian') { document.getElementById('viewHarian').style.display = 'block'; } 
        else if (jenis === 'orderVendor') { document.getElementById('viewOrderVendor').style.display = 'block'; renderTabelOrderVendor(); }
        else if (jenis === 'rekapTransfer') { document.getElementById('viewRekapTransfer').style.display = 'block'; renderViewRekapTransfer(); } 
        else if (jenis === 'mutasiKas') { document.getElementById('viewMutasiKas').style.display = 'block'; hitungAkumulasiKasTotal(); }
        else if (jenis === 'dashboard') { document.getElementById('viewDashboard').style.display = 'block'; renderDashboardGrafik(); }
        else if (jenis === 'masterProduk') { document.getElementById('viewMasterProduk').style.display = 'block'; resetFormMasterProduk(); renderTabelMasterProduk(); }
        else if (jenis === 'laporan') { if(document.getElementById('viewLaporanBaru')) document.getElementById('viewLaporanBaru').style.display = 'block'; }
    }
    function formatRupiah(angka) { return "Rp " + new Intl.NumberFormat('id-ID').format(angka || 0); }

    // --- LAPORAN BARU ---
    function gantiModeFilterLaporan(mode) {
        if (mode === 'mingguan') { document.getElementById('boxFilterMingguan').style.display = 'grid'; document.getElementById('boxFilterBulanan').style.display = 'none'; } 
        else { document.getElementById('boxFilterMingguan').style.display = 'none'; document.getElementById('boxFilterBulanan').style.display = 'block'; }
    }

    function prosesTampilkanLaporan() {
        const mode = document.getElementById('lapJenisTipe').value; let validKeys = []; let labelPeriode = "";
        if (mode === 'mingguan') {
            const start = document.getElementById('lapTglAwal').value; const end = document.getElementById('lapTglAkhir').value;
            if (!start || !end) { alert("Pilih rentang tanggal awal dan akhir!"); return; }
            Object.keys(dbStok).forEach(tgl => { if (tgl >= start && tgl <= end) validKeys.push(tgl); }); labelPeriode = `Periode: ${start} s/d ${end}`;
        } else {
            const bln = document.getElementById('lapBulanPick').value; if (!bln) { alert("Pilih bulan dan tahun!"); return; }
            Object.keys(dbStok).forEach(tgl => { if (tgl.startsWith(bln)) validKeys.push(tgl); }); labelPeriode = `Periode: Bulan ${bln}`;
        }
        let omsetTotal = 0, modalTotal = 0, profitTotal = 0; let rekapMap = {};
        masterProduk.forEach(mp => { const key = `${mp.nama}_${mp.kemasan || ''}_${mp.varian || ''}`; rekapMap[key] = { ...mp, totalTerjual: 0, totalOmset: 0, totalProfit: 0 }; });

        validKeys.forEach(tgl => {
            (dbStok[tgl] || []).forEach(p => {
                const terjual = (p.terjual !== "" && p.terjual !== null && p.terjual !== undefined) ? parseFloat(p.terjual) : 0;
                if (terjual > 0) {
                    const key = `${p.nama}_${p.kemasan || ''}_${p.varian || ''}`;
                    if (!rekapMap[key]) { rekapMap[key] = { ...p, totalTerjual: 0, totalOmset: 0, totalProfit: 0 }; }
                    rekapMap[key].totalTerjual += terjual; rekapMap[key].totalOmset += (terjual * p.jual); rekapMap[key].totalProfit += (terjual * p.margin);
                    modalTotal += (terjual * p.modal); profitTotal += (terjual * p.margin); omsetTotal += (terjual * p.jual);
                }
            });
        });

        const basisAlokasi = Math.max(0, profitTotal); const hakPartner = basisAlokasi * 0.40; let hakOwner = basisAlokasi * 0.60;
        if (mode === 'mingguan') { hakOwner = Math.max(0, hakOwner - 25000); document.getElementById('txtNotifOperasionalOwner').style.display = 'block'; } 
        else { document.getElementById('txtNotifOperasionalOwner').style.display = 'none'; }

        document.getElementById('txtLabelPeriodeLaporan').innerText = labelPeriode; document.getElementById('lapValOmset').innerText = formatRupiah(omsetTotal); document.getElementById('lapValModal').innerText = formatRupiah(modalTotal); document.getElementById('lapValProfit').innerText = formatRupiah(profitTotal); document.getElementById('lapValPartner').innerText = formatRupiah(hakPartner); document.getElementById('lapValOwner').innerText = formatRupiah(hakOwner);
        const tbody = document.getElementById('tbodyLaporanPreview'); tbody.innerHTML = '';
        const listTerjual = Object.values(rekapMap).filter(item => item.totalTerjual > 0);
        if (listTerjual.length === 0) { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#78716c; padding:15px;">Tidak ada transaksi terjual.</td></tr>`; } 
        else { listTerjual.forEach(p => { tbody.innerHTML += `<tr><td><strong>${p.nama}</strong></td><td><small style="color:#57534e;">${p.kemasan || '-'}</small> / <small style="color:#b45309; font-weight:bold;">${p.varian || '-'}</small></td><td style="text-align:center; font-weight:bold;">${p.totalTerjual}</td><td style="text-align:right;">${formatRupiah(p.totalOmset)}</td><td style="text-align:right; color:#16a34a; font-weight:bold;">${formatRupiah(p.totalProfit)}</td></tr>`; }); }
        dataCacheLaporan = { mode, labelPeriode, omsetTotal, modalTotal, profitTotal, hakPartner, hakOwner, listTerjual };
        document.getElementById('boxHasilLaporan').style.display = 'block';
    }

    function cetakPDFDariPreview() {
        if (!dataCacheLaporan || typeof html2pdf === 'undefined') { alert("Data laporan kosong. Tampilkan preview terlebih dahulu!"); return; }
        document.getElementById('pdfJudulPeriode').innerText = dataCacheLaporan.mode === 'mingguan' ? 'LAPORAN MINGGUAN' : 'LAPORAN BULANAN'; document.getElementById('pdfTglPeriode').innerText = dataCacheLaporan.labelPeriode; document.getElementById('pdfTotalOmset').innerText = formatRupiah(dataCacheLaporan.omsetTotal); document.getElementById('pdfTotalModal').innerText = formatRupiah(dataCacheLaporan.modalTotal); document.getElementById('pdfTotalProfitBersih').innerText = formatRupiah(dataCacheLaporan.profitTotal); document.getElementById('pdfAllocPartner').innerText = formatRupiah(dataCacheLaporan.hakPartner); document.getElementById('pdfAllocOwner').innerText = formatRupiah(dataCacheLaporan.hakOwner);
        const pdfTbody = document.getElementById('pdfTbodyProdukPeriode'); pdfTbody.innerHTML = '';
        dataCacheLaporan.listTerjual.forEach(p => { pdfTbody.innerHTML += `<tr><td><strong>${p.nama}</strong><br><small style="color:#78716c">${p.kemasan || ''}</small></td><td>${p.varian || '-'}</td><td style="text-align:center;">${p.totalTerjual}</td><td style="text-align:right;">${formatRupiah(p.totalOmset)}</td><td style="text-align:right;">${formatRupiah(p.totalProfit)}</td></tr>`; });
        const element = document.getElementById('pdfAreaPeriode'); element.style.display = 'block';
        html2pdf().set({ margin: 5, filename: `Rekap_${dataCacheLaporan.mode}_${new Date().toISOString().slice(0, 10)}.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(element).save().then(() => { element.style.display = 'none'; });
    }

    // --- FORM VENDOR & WARNING STOK ---
    function bukaModalVendor() { document.getElementById('inVenNama').value = ''; document.getElementById('inVenKemasan').value = ''; document.getElementById('inVenVol').value = ''; document.getElementById('inVenRasa').value = ''; document.getElementById('inVenHarga').value = ''; document.getElementById('modalTambahVendor').classList.add('active'); }
    function tutupModalVendor() { document.getElementById('modalTambahVendor').classList.remove('active'); }
    function simpanProdukVendorBaru(e) { e.preventDefault(); const p = { nama: document.getElementById('inVenNama').value.trim(), kemasan: document.getElementById('inVenKemasan').value.trim(), vol: document.getElementById('inVenVol').value.trim(), isi: "-", rasa: document.getElementById('inVenRasa').value.trim(), harga: parseFloat(document.getElementById('inVenHarga').value) || 0 }; masterVendor.push(p); if(db) { db.collection('appData').doc('masterVendor').set({ list: masterVendor }).then(() => { tutupModalVendor(); showToast('📦 Produk Vendor Ditambahkan!'); renderTabelOrderVendor(); }); } }
    function hapusProdukVendor(idx) { if(confirm("Hapus produk ini dari vendor?")) { masterVendor.splice(idx, 1); if(db) db.collection('appData').doc('masterVendor').set({ list: masterVendor }); renderTabelOrderVendor(); } }
    function updateHargaVendorDB(idx, newVal) { const hrgBaru = parseFloat(newVal) || 0; masterVendor[idx].harga = hrgBaru; if(db) db.collection('appData').doc('masterVendor').set({ list: masterVendor }); hitungTotalOrderVendor(); }

    function cekStokWarning() {
        const tgl = document.getElementById('tglOps').value; const items = dbStok[tgl] || []; const tbodyWarn = document.getElementById('tbodyWarningStok'); const boxWarn = document.getElementById('boxWarningStok');
        if (!tbodyWarn || !boxWarn) return; tbodyWarn.innerHTML = ''; let countWarning = 0;
        items.forEach(p => {
            const awal = parseFloat(p.awal) || 0; const tambah = parseFloat(p.tambah) || 0; const kurang = parseFloat(p.kurang) || 0; const totalStok = awal + tambah - kurang;
            const terjual = (p.terjual !== "" && p.terjual !== null && p.terjual !== undefined) ? parseFloat(p.terjual) : 0;
            let sisa = totalStok - terjual; let minS = 5; 
            const m = masterProduk.find(x => x.nama === p.nama && x.kemasan === p.kemasan && x.varian === p.varian);
            if (m && m.minStok !== undefined) { minS = m.minStok; } else { const m2 = masterProduk.find(x => x.nama === p.nama); if (m2 && m2.minStok !== undefined) minS = m2.minStok; }
            if (sisa <= minS) { countWarning++; tbodyWarn.innerHTML += `<tr><td><strong style="color:#7f1d1d;">${p.nama}</strong><br><small style="color:#991b1b;">${p.kemasan||'-'} | ${p.varian||'-'}</small></td><td style="text-align:center; color:#dc2626; font-weight:900; font-size:1rem;">${sisa}</td><td style="text-align:center; font-weight:700; color:#b91c1c;">${minS}</td></tr>`; }
        });
        boxWarn.style.display = countWarning > 0 ? 'block' : 'none';
    }

    function renderTabelOrderVendor() {
        const tbody = document.getElementById('tbodyOrderVendor'); tbody.innerHTML = '';
        masterVendor.forEach((p, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td><div style="font-weight:800; color:var(--text-main); font-size:0.75rem;">${p.nama}</div><small style="color:#78716c;">${p.kemasan}</small></td><td style="text-align:center;"><div style="font-weight:600; font-size:0.75rem;">${p.vol || ''}</div><small style="color:#78716c;">Isi: ${p.isi || '-'}</small></td><td style="text-align:center; font-weight:700; color:#44403c; font-size:0.7rem;">${p.rasa}</td><td style="text-align:center;"><input type="number" id="qtyOrder_${idx}" class="input-stok" style="background:#f0fdf4; border-color:#86efac; width:50px;" min="0" oninput="hitungTotalOrderVendor()"></td><td style="text-align:center;"><input type="number" id="hargaOrder_${idx}" class="input-stok" style="width:80px; font-weight:600;" value="${p.harga}" min="0" oninput="hitungTotalOrderVendor()" onchange="updateHargaVendorDB(${idx}, this.value)"></td><td style="text-align:right; font-weight:800; color:#1d4ed8;" id="totalOrder_${idx}">0</td><td style="text-align:center;"><button onclick="hapusProdukVendor(${idx})" class="btn btn-danger" style="padding:4px; font-size:0.6rem; width:auto; border-radius:4px;">🗑️</button></td>`;
            tbody.appendChild(tr);
        });
        hitungTotalOrderVendor(); cekStokWarning(); 
    }

    function hitungTotalOrderVendor() { let grandTotal = 0; masterVendor.forEach((p, idx) => { const qty = parseFloat(document.getElementById(`qtyOrder_${idx}`)?.value) || 0; const hrg = parseFloat(document.getElementById(`hargaOrder_${idx}`)?.value) || p.harga; const total = qty * hrg; grandTotal += total; const tdTotal = document.getElementById(`totalOrder_${idx}`); if(tdTotal) tdTotal.innerText = total > 0 ? new Intl.NumberFormat('id-ID').format(total) : "0"; }); document.getElementById('txtGrandTotalOrder').innerText = formatRupiah(grandTotal); }
    function kirimOrderWA() { const tgl = document.getElementById('tglOps').value; let text = `*FORM ORDER KEDAI SOYOU*\nTanggal: ${tgl}\n\n`; let grandTotal = 0; let adaOrder = false; masterVendor.forEach((p, idx) => { const qty = parseFloat(document.getElementById(`qtyOrder_${idx}`)?.value) || 0; const hrg = parseFloat(document.getElementById(`hargaOrder_${idx}`)?.value) || p.harga; if(qty > 0) { adaOrder = true; const total = qty * hrg; grandTotal += total; text += `- ${p.nama} (${p.kemasan}, ${p.vol}, ${p.rasa}) - *${qty} Krt* - Rp ${new Intl.NumberFormat('id-ID').format(total)}\n`; } }); if(!adaOrder) { alert("⚠️ Anda belum mengisi Qty produk!"); return; } text += `\n*GRAND TOTAL ORDER: ${formatRupiah(grandTotal)}*`; window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); }
    function bukaModalKelolaAkun() { if (currentUser.role !== 'owner') return; toggleSidebar(); document.getElementById('modalKelolaAkun').classList.add('active'); muatDaftarAkun(); }
    function tutupModalKelolaAkun() { document.getElementById('modalKelolaAkun').classList.remove('active'); }
    function muatDaftarAkun() { if(!db) return; db.collection('users').get().then(snap => { listAkunKasir = []; const tbody = document.getElementById('tbodyDaftarAkun'); tbody.innerHTML = ''; snap.forEach(doc => { const data = doc.data(); listAkunKasir.push(data); const roleBadge = data.role === 'owner' ? '<span style="color:#d97706;font-weight:bold;">👑 Owner</span>' : '🧑‍🍳 Kasir'; const aksiBtn = data.hp === currentUser.hp ? '<i>(Anda)</i>' : `<button onclick="hapusAkunUser('${data.hp}')" class="btn btn-danger" style="padding:4px; font-size:0.6rem; margin:0; width:auto;">Hapus</button>`; tbody.innerHTML += `<tr><td><strong>${data.nama}</strong><br><small style="color:var(--text-muted);">Pass: ${data.password}</small></td><td>${data.hp}</td><td>${roleBadge}</td><td style="text-align:center;">${aksiBtn}</td></tr>`; }); }); }
    function simpanAkunBaru(e) { e.preventDefault(); const nama = document.getElementById('inAkunNama').value.trim(); const hp = document.getElementById('inAkunHp').value.trim(); const password = document.getElementById('inAkunPass').value.trim(); const role = document.getElementById('inAkunRole').value; if(!db) return; db.collection('users').doc(hp).set({ nama, hp, password, role }).then(() => { alert(`Akun dibuat!\nHP: ${hp}`); document.getElementById('inAkunNama').value = ''; document.getElementById('inAkunHp').value = ''; document.getElementById('inAkunPass').value = ''; muatDaftarAkun(); }); }
    function hapusAkunUser(hp) { if(confirm(`Hapus akses No HP ${hp}?`)) { db.collection('users').doc(hp).delete().then(() => { muatDaftarAkun(); }); } }

    function inisiatisasiRealtimeListener() {
        if (!db) throw new Error("Database tidak terhubung!");
        db.collection('statusHarian').onSnapshot(snapshot => { 
            snapshot.forEach(doc => { dbStatusKunci[doc.id] = doc.data().terkunci; }); 
            const tgl = document.getElementById('tglOps').value; if(dbStok[tgl]) cekDanTarikDataKemarin(tgl); applyLockUI(); 
        });
        db.collection('appData').doc('masterProduk').onSnapshot(doc => { 
            if (doc.exists && doc.data().list) { masterProduk = doc.data().list; } 
            else { db.collection('appData').doc('masterProduk').set({ list: defaultMasterProduk }); masterProduk = defaultMasterProduk; } 
            loadDataTanggalLocal(); 
        });
        db.collection('appData').doc('masterVendor').onSnapshot(doc => {
            if (doc.exists && doc.data().list) { masterVendor = doc.data().list; } 
            else { db.collection('appData').doc('masterVendor').set({ list: defaultMasterVendor }); masterVendor = defaultMasterVendor; }
            if(document.getElementById('viewOrderVendor').style.display === 'block') { if (document.activeElement && document.activeElement.tagName === 'INPUT') return; renderTabelOrderVendor(); }
        });
        db.collection('stokHarian').onSnapshot(snapshot => { 
            snapshot.forEach(doc => { dbStok[doc.id] = doc.data().items; }); 
            const tgl = document.getElementById('tglOps').value; 
            if (!document.activeElement || !document.activeElement.classList.contains('input-stok')) { syncStokDenganMaster(tgl); cekDanTarikDataKemarin(tgl); renderTabelMatriks(); updateKalkulasi(); } 
        });
        db.collection('kasMasuk').onSnapshot(snapshot => { 
            snapshot.forEach(doc => { dbKasMasuk[doc.id] = doc.data(); }); 
            if (document.activeElement.id !== 'inCash' && document.activeElement.id !== 'inQris') { loadKasMasukUI(); } updateKalkulasi(); 
        });
        db.collection('logKas').onSnapshot(snapshot => { dbLogKas = []; snapshot.forEach(doc => { dbLogKas.push({ id: doc.id, ...doc.data() }); }); hitungAkumulasiKasTotal(); });
    }

        // --- PERBAIKAN FINAL BUG SISA KEMARIN ---
    function cekDanTarikDataKemarin(tgl) {
        if (isDataLocked(tgl)) return;
        
        let [y, m, d] = tgl.split('-'); 
        let dateObj = new Date(y, m - 1, d); 
        dateObj.setDate(dateObj.getDate() - 1); 
        let tglKemarin = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
        
        let isKemarinLocked = dbStatusKunci[tglKemarin] === true; 
        let needsUpdateUI = false;

        if (dbStok[tgl]) {
            let isNeedsPullStok = dbStok[tgl].some(p => p.awal === "" || p.awal === null || p.awal === undefined);
            if (isNeedsPullStok && dbStok[tglKemarin] && dbStok[tglKemarin].length > 0) {
                if (isKemarinLocked) {
                    dbStok[tgl].forEach((p, idx) => {
                        if (p.awal === "" || p.awal === null || p.awal === undefined) {
                            // Pencarian yang lebih akurat dan kebal huruf besar/kecil/spasi
                            let pKemarin = dbStok[tglKemarin].find(x => 
                                (x.nama||'').trim().toLowerCase() === (p.nama||'').trim().toLowerCase() && 
                                (x.kemasan||'').trim().toLowerCase() === (p.kemasan||'').trim().toLowerCase() && 
                                (x.varian||'').trim().toLowerCase() === (p.varian||'').trim().toLowerCase()
                            );
                            
                            if (!pKemarin) pKemarin = dbStok[tglKemarin].find(x => (x.nama||'').trim().toLowerCase() === (p.nama||'').trim().toLowerCase()); 
                            
                            if (pKemarin) {
                                // HITUNG MATEMATIS LANGSUNG DARI SUMBERNYA (Lebih Akurat)
                                const aw = parseFloat(pKemarin.awal) || 0; 
                                const tb = parseFloat(pKemarin.tambah) || 0; 
                                const kr = parseFloat(pKemarin.kurang) || 0;
                                const tj = parseFloat(pKemarin.terjual) || 0;
                                
                                let sisaHitung = (aw + tb - kr) - tj;
                                if (sisaHitung < 0) sisaHitung = 0; // Cegah minus
                                
                                dbStok[tgl][idx].awal = sisaHitung; 
                                needsUpdateUI = true;
                            }
                        }
                    });
                    
                    if (needsUpdateUI && db) { 
                        db.collection('stokHarian').doc(tgl).set({ items: dbStok[tgl] }); 
                    }
                } else {
                    if (hasAlertedTgl !== tgl) { 
                        alert(`⚠️ Data tanggal ${tglKemarin} BELUM DIGEMBOK!\nBuka tanggal ${tglKemarin} lalu klik '🔓 BUKA' menjadi '🔒 TERKUNCI' agar stok sisa otomatis ditarik.`); 
                        hasAlertedTgl = tgl; 
                    }
                }
            }
        }
        if (needsUpdateUI && document.activeElement && document.activeElement.tagName !== 'INPUT') { 
            renderTabelMatriks(); 
            updateKalkulasi(); 
        }
    }
    function syncStokDenganMaster(tgl) { 
        if (!dbStok[tgl]) { dbStok[tgl] = masterProduk.map(p => ({ ...p, awal: "", tambah: "", kurang: "", terjual: "", sisa: "" })); } 
        else { 
            let currentStok = dbStok[tgl], newStokList = []; 
            masterProduk.forEach(mp => { 
                let found = currentStok.find(item => item.nama === mp.nama && item.kemasan === mp.kemasan && item.varian === mp.varian);
                if(!found) found = currentStok.find(item => item.nama === mp.nama);
                if (found) newStokList.push({ ...mp, awal: found.awal, tambah: found.tambah || "", kurang: found.kurang || "", terjual: found.terjual || "", sisa: found.sisa }); 
                else newStokList.push({ ...mp, awal: "", tambah: "", kurang: "", terjual: "", sisa: "" }); 
            }); 
            dbStok[tgl] = newStokList; 
        } 
    }

    function updateNilaiStokLokal(idx, tipe, val) { 
        const tgl = document.getElementById('tglOps').value; 
        if (!dbStok[tgl]) syncStokDenganMaster(tgl); 
        if (tipe === 'awal') dbStok[tgl][idx].awal = val; if (tipe === 'tambah') dbStok[tgl][idx].tambah = val; if (tipe === 'kurang') dbStok[tgl][idx].kurang = val; if (tipe === 'terjual') dbStok[tgl][idx].terjual = val; 
        const p = dbStok[tgl][idx];
        const awal = parseFloat(p.awal) || 0; const tambah = parseFloat(p.tambah) || 0; const kurang = parseFloat(p.kurang) || 0; const totalStok = awal + tambah - kurang;
        const terjual = (p.terjual !== "" && p.terjual !== null && p.terjual !== undefined) ? parseFloat(p.terjual) : null;
        if (terjual !== null) { p.sisa = totalStok - terjual; } else { p.sisa = ""; }
        const cellTotal = document.getElementById(`text_total_${idx}`); const cellSisa = document.getElementById(`text_sisa_${idx}`);
        if (cellTotal) cellTotal.innerText = totalStok; if (cellSisa) cellSisa.innerText = p.sisa === "" ? "-" : p.sisa;
        updateKalkulasi(); 
    }
    
    function loadDataTanggalLocal() { const tgl = document.getElementById('tglOps').value; syncStokDenganMaster(tgl); cekDanTarikDataKemarin(tgl); renderTabelMatriks(); loadKasMasukUI(); updateKalkulasi(); applyLockUI(); }
    function isDataLocked(tgl) { return dbStatusKunci[tgl] === true; }
    function toggleLock() { const tgl = document.getElementById('tglOps').value; const currentlyLocked = isDataLocked(tgl); if (currentlyLocked) { if(confirm("Buka gembok data hari ini?")) { setLockStatus(tgl, false); } } else { if(confirm("Kunci data hari ini?")) { setLockStatus(tgl, true); } } }
    function setLockStatus(tgl, status) { if(db) { db.collection('statusHarian').doc(tgl).set({ terkunci: status }); } else { dbStatusKunci[tgl] = status; applyLockUI(); } }
    function applyLockUI() { const tgl = document.getElementById('tglOps').value; const locked = isDataLocked(tgl); const btnToggle = document.getElementById('btnToggleLock'); if(locked) { btnToggle.className = 'btn-lock locked'; btnToggle.innerHTML = '🔒 TERKUNCI'; } else { btnToggle.className = 'btn-lock unlock'; btnToggle.innerHTML = '🔓 TERBUKA'; } const idsToDisable = ['inCash', 'inQris']; idsToDisable.forEach(id => { const el = document.getElementById(id); if(el) el.disabled = locked; }); if (document.activeElement && document.activeElement.tagName !== 'INPUT') { renderTabelMatriks(); } }

    let sortKolomHarian = 'nama', sortAscHarian = true, searchHarianText = '';
    function filterStokHarian(val) { searchHarianText = val.toLowerCase(); renderTabelMatriks(); }
    function sortStokHarian(kolom) { if (sortKolomHarian === kolom) { sortAscHarian = !sortAscHarian; } else { sortKolomHarian = kolom; sortAscHarian = true; } renderTabelMatriks(); }

    function renderTabelMatriks() {
        const tgl = document.getElementById('tglOps').value; const locked = isDataLocked(tgl); const thead = document.getElementById('theadMatriks');
        thead.innerHTML = `<tr><th style="text-align:left; cursor:pointer; color:#1d4ed8;" onclick="sortStokHarian('nama')">Nama Produk <span id="sort_hr_nama">🔼</span></th><th style="text-align:left; cursor:pointer; color:#1d4ed8;" onclick="sortStokHarian('kemasan')">Kemasan <span id="sort_hr_kemasan"></span></th><th style="text-align:left; cursor:pointer; color:#1d4ed8;" onclick="sortStokHarian('varian')">Varian <span id="sort_hr_varian"></span></th><th style="background:#fef9c3; color:#854d0e;">Awal</th><th style="background:#dcfce7; color:#166534; font-size: 0.9rem;">+</th><th style="background:#fee2e2; color:#991b1b; font-size: 0.9rem;">-</th><th style="background:#f5f5f4; color:#292524; font-size: 0.8rem;">Total</th><th style="background:#e0f2fe; color:#0369a1;">Terjual</th><th style="background:#e7e5e4; color:#44403c;">Sisa</th><th>Harga</th><th>Aksi</th></tr>`;
        const tbody = document.getElementById('tbodyMatriks'); let dataTampil = (dbStok[tgl] || []).map((p, index) => ({ ...p, originalIndex: index }));
        if (searchHarianText !== '') { dataTampil = dataTampil.filter(p => (p.nama && p.nama.toLowerCase().includes(searchHarianText)) || (p.kemasan && p.kemasan.toLowerCase().includes(searchHarianText)) || (p.varian && p.varian.toLowerCase().includes(searchHarianText)) ); }
        if (sortKolomHarian !== '') { dataTampil.sort((a, b) => { let valA = a[sortKolomHarian] || ''; let valB = b[sortKolomHarian] || ''; if (typeof valA === 'string') valA = valA.toLowerCase(); if (typeof valB === 'string') valB = valB.toLowerCase(); if (valA < valB) return sortAscHarian ? -1 : 1; if (valA > valB) return sortAscHarian ? 1 : -1; return 0; }); }
        ['nama', 'kemasan', 'varian'].forEach(h => { const el = document.getElementById(`sort_hr_${h}`); if (el) { if (sortKolomHarian === h) el.innerText = sortAscHarian ? ' 🔼' : ' 🔽'; else el.innerText = ''; } });
        let htmlRows = '';
        dataTampil.forEach((p) => {
            const idx = p.originalIndex; 
            const awal = (p.awal !== "" && p.awal !== null) ? parseFloat(p.awal) : 0; const tambah = (p.tambah !== "" && p.tambah !== null && p.tambah !== undefined) ? parseFloat(p.tambah) : 0; const kurang = (p.kurang !== "" && p.kurang !== null && p.kurang !== undefined) ? parseFloat(p.kurang) : 0; const totalStok = awal + tambah - kurang;
            const terjual = (p.terjual !== "" && p.terjual !== null && p.terjual !== undefined) ? p.terjual : "";
            let textSisa = "-"; if (terjual !== "") { textSisa = totalStok - parseFloat(terjual); }
            const actionHTML = locked ? '<span style="font-size:0.8rem;color:#a8a29e;">🔒</span>' : `<button onclick="hapusProduk(${idx})" class="btn btn-danger" style="padding:4px 6px; font-size:0.6rem; margin:0; border-radius:4px;">🗑️</button>`;
            htmlRows += `<tr><td><div style="font-weight:700; color:var(--text-main); font-size:0.75rem;">${p.nama}</div></td><td><div style="color:#57534e; font-size:0.7rem;">${p.kemasan || '-'}</div></td><td><div style="font-weight:600; color:#44403c; font-size:0.7rem;">${p.varian || '-'}</div></td><td style="text-align:center;"><input type="number" class="input-stok input-pagi" id="pagi_${idx}" value="${p.awal}" min="0" oninput="updateNilaiStokLokal(${idx}, 'awal', this.value)" onchange="simpanStokOtomatis()" ${locked ? 'disabled' : ''}></td><td style="text-align:center;"><input type="number" class="input-stok input-tambah" id="tambah_${idx}" value="${p.tambah || ''}" min="0" oninput="updateNilaiStokLokal(${idx}, 'tambah', this.value)" onchange="simpanStokOtomatis()" ${locked ? 'disabled' : ''}></td><td style="text-align:center;"><input type="number" class="input-stok input-kurang" id="kurang_${idx}" value="${p.kurang || ''}" min="0" oninput="updateNilaiStokLokal(${idx}, 'kurang', this.value)" onchange="simpanStokOtomatis()" ${locked ? 'disabled' : ''}></td><td id="text_total_${idx}" style="text-align:center; font-weight:800; font-size:0.85rem; color:#292524; background:#fafaf9;">${totalStok}</td><td style="text-align:center;"><input type="number" class="input-stok" style="background:#f0f9ff; border-color:#bae6fd;" id="terjual_${idx}" value="${terjual}" min="0" oninput="updateNilaiStokLokal(${idx}, 'terjual', this.value)" onchange="simpanStokOtomatis()" ${locked ? 'disabled' : ''}></td><td id="text_sisa_${idx}" style="text-align:center; font-weight:800; font-size:0.85rem; color:#44403c; background:#f5f5f4;">${textSisa}</td><td style="text-align:right; font-weight:600;">${new Intl.NumberFormat('id-ID').format(p.jual)}</td><td style="text-align:center;">${actionHTML}</td></tr>`;
        });
        tbody.innerHTML = htmlRows;
    }
    
    function simpanStokOtomatis() { const tgl = document.getElementById('tglOps').value; if(isDataLocked(tgl)) return; if(!db) return; db.collection('stokHarian').doc(tgl).set({ items: dbStok[tgl] }).then(() => { if (navigator.onLine) showToast('✅ Tersimpan otomatis!'); }); }
    function simpanKasMasuk(isAutoTrigger = false) { const tgl = document.getElementById('tglOps').value; if(isDataLocked(tgl)) return; if(!db) return; const kasData = { cash: parseFloat(document.getElementById('inCash').value) || 0, qris: parseFloat(document.getElementById('inQris').value) || 0 }; db.collection('kasMasuk').doc(tgl).set(kasData).then(() => { if (isAutoTrigger && navigator.onLine) showToast('✅ Tersimpan otomatis!'); }); }
    function loadKasMasukUI() { const kas = dbKasMasuk[document.getElementById('tglOps').value] || { cash: 0, qris: 0 }; document.getElementById('inCash').value = kas.cash; document.getElementById('inQris').value = kas.qris; }

    // --- PERBAIKAN BUG OMSET (Fokus Terjual) ---
    function updateKalkulasi() {
        const tgl = document.getElementById('tglOps').value; if (!dbStok[tgl] || !Array.isArray(dbStok[tgl])) return;
        const items = dbStok[tgl]; let totalOmset = 0, totalModalBelanja = 0, totalProfit = 0; 
        
        items.forEach(p => { 
            const terjual = (p.terjual !== "" && p.terjual !== null && p.terjual !== undefined) ? parseFloat(p.terjual) : 0;
            if (terjual > 0) { totalOmset += (terjual * p.jual); totalModalBelanja += (terjual * p.modal); totalProfit += (terjual * p.margin); } 
        });
        
        const cashInput = parseFloat(document.getElementById('inCash').value) || 0; const qrisInput = parseFloat(document.getElementById('inQris').value) || 0;
        const totalUangSeharusnya = totalOmset; const totalUangFisikDigital = cashInput + qrisInput; const selisih = totalUangFisikDigital - totalUangSeharusnya;
        
        document.getElementById('txtUangSeharusnya').innerText = formatRupiah(totalUangSeharusnya); document.getElementById('txtAktualUang').innerText = formatRupiah(totalUangFisikDigital); 
        const elSelisih = document.getElementById('txtSelisih'); const boxEstimasi = document.getElementById('boxEstimasiEsTeh');
        
        if (selisih < 0) { elSelisih.innerText = "- " + formatRupiah(Math.abs(selisih)); elSelisih.style.color = "#dc2626"; boxEstimasi.innerHTML = `<span style="color:#dc2626;">⚠️ Uang Aktual <strong>KURANG</strong> dari Omset Sistem.</span>`; } 
        else if (selisih > 0) { elSelisih.innerText = "+ " + formatRupiah(selisih); elSelisih.style.color = "#16a34a"; boxEstimasi.innerHTML = `<span style="color:#16a34a;">✨ Uang Aktual <strong>LEBIH</strong> dari Omset Sistem.</span>`; } 
        else { elSelisih.innerText = "Rp 0 (Pas)"; elSelisih.style.color = "#292524"; boxEstimasi.innerHTML = `<span style="color:#78716c;">✅ Tidak ada selisih. Uang sesuai Omset!</span>`; }

        document.getElementById('allocModalBelanja').innerText = formatRupiah(totalModalBelanja); document.getElementById('totalProfitBersih').innerText = formatRupiah(totalProfit); 
        let basisAlokasi = Math.max(0, totalProfit); document.getElementById('allocPartner').innerText = formatRupiah(basisAlokasi * 0.40); document.getElementById('allocOwner').innerText = formatRupiah(basisAlokasi * 0.60); 
        
        hitungAkumulasiKasTotal(); renderViewRekapTransfer(); 
        if (currentUser && currentUser.role === 'owner') { if(document.getElementById('viewDashboard').style.display === 'block') renderDashboardGrafik(); }
    }

    function renderViewRekapTransfer() {
        const tgl = document.getElementById('tglOps').value; const items = dbStok[tgl] || []; let totalModalBelanja = 0, profitBersih = 0;
        items.forEach(p => { 
            const terjual = (p.terjual !== "" && p.terjual !== null && p.terjual !== undefined) ? parseFloat(p.terjual) : 0;
            if (terjual > 0) { profitBersih += (terjual * p.margin); totalModalBelanja += (terjual * p.modal); } 
        });
        const alokasiBasis = Math.max(0, profitBersih); const hakPartner = alokasiBasis * 0.40; const hakOwner = alokasiBasis * 0.60; const totalA = totalModalBelanja + hakPartner + hakOwner;
        
        document.getElementById('rtKasModal').innerText = formatRupiah(totalModalBelanja); document.getElementById('rtKasPartner').innerText = formatRupiah(hakPartner); document.getElementById('rtKasOwner').innerText = formatRupiah(hakOwner); document.getElementById('rtTotalA').innerText = formatRupiah(totalA);
        const cashInput = parseFloat(document.getElementById('inCash').value) || 0; const qrisInput = parseFloat(document.getElementById('inQris').value) || 0; const totalB = cashInput + qrisInput;
        document.getElementById('rtCash').innerText = formatRupiah(cashInput); document.getElementById('rtQris').innerText = formatRupiah(qrisInput); document.getElementById('rtTotalB').innerText = formatRupiah(totalB);
        const selisihSetor = totalB - totalA; const finalBox = document.getElementById('rtFinalBox'), finalValue = document.getElementById('rtFinalValue'), finalKet = document.getElementById('rtFinalKet');
        
        if (selisihSetor < 0) { finalBox.style.background = '#fff1f2'; finalBox.style.border = '2px solid #fda4af'; finalValue.style.color = '#be123c'; finalValue.innerText = "- " + formatRupiah(Math.abs(selisihSetor)); finalKet.style.color = '#9f1239'; finalKet.innerText = "⚠️ SELISIH KURANG! Uang aktual kurang dari omset."; } 
        else if (selisihSetor === 0) { finalBox.style.background = '#f0fdf4'; finalBox.style.border = '2px solid #86efac'; finalValue.style.color = '#15803d'; finalValue.innerText = formatRupiah(0); finalKet.style.color = '#166534'; finalKet.innerText = "✅ BALANCE PERFECT!"; } 
        else { finalBox.style.background = '#eff6ff'; finalBox.style.border = '2px solid #93c5fd'; finalValue.style.color = '#1d4ed8'; finalValue.innerText = `+ ${formatRupiah(selisihSetor)}`; finalKet.style.color = '#1e3a8a'; finalKet.innerText = "✨ SELISIH LEBIH! Ada surplus uang aktual."; }
    }

    function hitungAkumulasiKasTotal() { 
        let kasModal = 0, kasPartner = 0, kasOwner = 0; const validDates = Object.keys(dbStok).filter(tgl => tgl.match(/^\d{4}-\d{2}-\d{2}$/)).sort(); 
        validDates.forEach(tgl => { 
            let pKotor = 0, modalB = 0; 
            dbStok[tgl].forEach(p => { 
                const terjual = (p.terjual !== "" && p.terjual !== null && p.terjual !== undefined) ? parseFloat(p.terjual) : 0;
                if (terjual > 0) { pKotor += (terjual * p.margin); modalB += (terjual * p.modal); } 
            }); 
            const basis = Math.max(0, pKotor); kasModal += modalB; kasPartner += (basis * 0.40); kasOwner += (basis * 0.60); 
        }); 
        dbLogKas.forEach(l => { const n = l.tipe === 'masuk' ? l.nominal : -l.nominal; if (l.jenis === 'Modal Belanja') kasModal += n; else if (l.jenis === 'Hak Partner') kasPartner += n; else if (l.jenis === 'Hak Owner') kasOwner += n; }); 
        document.getElementById('sbKasModal').innerText = formatRupiah(kasModal); document.getElementById('sbKasPartner').innerText = formatRupiah(kasPartner); document.getElementById('sbKasOwner').innerText = formatRupiah(kasOwner); renderMutasiTabKas(activeKasTab); 
    }
    
    function gantiTabKas(jenis, el) { activeKasTab = jenis; document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); if(el) el.classList.add('active'); renderMutasiTabKas(jenis); }
    
    function renderMutasiTabKas(jenis) { 
        document.getElementById('txtNamaTabKas').innerText = `Dompet ${jenis}`; const tbody = document.getElementById('tbodyMutasiKas'); tbody.innerHTML = ''; let mutasiList = []; const validDates = Object.keys(dbStok).filter(tgl => tgl.match(/^\d{4}-\d{2}-\d{2}$/)).sort(); 
        validDates.forEach(tgl => { 
            let pKotor = 0, modalB = 0; 
            dbStok[tgl].forEach(p => { const terjual = (p.terjual !== "" && p.terjual !== null && p.terjual !== undefined) ? parseFloat(p.terjual) : 0; if (terjual > 0) { pKotor += (terjual * p.margin); modalB += (terjual * p.modal); } }); 
            const pB = Math.max(0, pKotor); 
            if (jenis === 'Modal Belanja' && modalB > 0) mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: 'Masuk: Modal Terkumpul', nominal: modalB, auto: true }); 
            else if (jenis === 'Hak Partner' && pB > 0) mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: 'Masuk: Hak Partner (40%)', nominal: pB * 0.40, auto: true }); 
            else if (jenis === 'Hak Owner' && pB > 0) mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: 'Masuk: Hak Anda (60%)', nominal: pB * 0.60, auto: true }); 
        }); 
        dbLogKas.forEach(l => { if (l.jenis === jenis) mutasiList.push({ ...l, auto: false }); }); mutasiList.sort((a, b) => a.tgl.localeCompare(b.tgl)); let saldo = 0; 
        mutasiList.forEach(m => { saldo += (m.tipe === 'masuk' ? m.nominal : -m.nominal); const tr = document.createElement('tr'); tr.innerHTML = `<td>${m.tgl}</td><td><span style="color:${m.tipe==='masuk'?'#16a34a':'#dc2626'}; font-weight:800; font-size:0.65rem;">${m.tipe==='masuk'?'🟢 IN':'🔴 OUT'}</span></td><td style="font-weight:600;">${m.ket}</td><td style="font-weight:800; text-align:right;">${formatRupiah(m.nominal)}</td><td style="font-weight:800; color:#2563eb; text-align:right;">${formatRupiah(saldo)}</td><td style="text-align:center;">${!m.auto ? `<button onclick="hapusMutasiKas('${m.id}')" class="btn btn-danger" style="padding:4px; font-size:0.6rem;">Del</button>` : `<small style="font-weight:bold; color:#78716c;">Auto</small>`}</td>`; tbody.appendChild(tr); }); 
        document.getElementById('txtTotalTabKas').innerText = formatRupiah(saldo); 
    }
    
    function hapusMutasiKas(docId) { if(db && confirm("Hapus kas ini?")) db.collection('logKas').doc(docId).delete(); }
    
    function resetFormMasterProduk() { document.getElementById('editIndexProduk').value="-1"; document.getElementById('inputNamaProduk').value=""; document.getElementById('inputKemasanProduk').value=""; document.getElementById('inputVarianProduk').value=""; document.getElementById('inputModalProduk').value=""; document.getElementById('inputJualProduk').value=""; document.getElementById('inputMarginProduk').value=""; document.getElementById('inputMinStokProduk').value="5"; document.getElementById('btnSimpanProduk').innerText="Simpan Produk"; }
    function hitungMarginForm() { document.getElementById('inputMarginProduk').value=Math.max(0,(parseFloat(document.getElementById('inputJualProduk').value)||0)-(parseFloat(document.getElementById('inputModalProduk').value)||0)); }
    function simpanProdukBaru(e) { e.preventDefault(); const p = { nama: document.getElementById('inputNamaProduk').value.trim(), kemasan: document.getElementById('inputKemasanProduk').value.trim(), varian: document.getElementById('inputVarianProduk').value.trim(), modal: parseFloat(document.getElementById('inputModalProduk').value)||0, jual: parseFloat(document.getElementById('inputJualProduk').value)||0, margin: 0, minStok: parseFloat(document.getElementById('inputMinStokProduk').value)||0 }; p.margin = p.jual - p.modal; const idx = parseInt(document.getElementById('editIndexProduk').value); if(idx >= 0) masterProduk[idx] = p; else masterProduk.push(p); if(db) { db.collection('appData').doc('masterProduk').set({list:masterProduk}).then(() => { resetFormMasterProduk(); renderTabelMasterProduk(); showToast("✅ Produk Berhasil Disimpan!"); }); } else { resetFormMasterProduk(); renderTabelMasterProduk(); showToast("✅ Disimpan Lokal"); } }
    
    function renderTabelMasterProduk() { 
        const t = document.getElementById('tbodyMasterProduk'); let dataTampil = masterProduk.map((p, index) => ({ ...p, originalIndex: index }));
        if (searchMasterText !== '') { dataTampil = dataTampil.filter(p => p.nama.toLowerCase().includes(searchMasterText) || (p.kemasan && p.kemasan.toLowerCase().includes(searchMasterText)) || (p.varian && p.varian.toLowerCase().includes(searchMasterText)) ); }
        dataTampil.sort((a, b) => { let valA = a[sortKolomMaster] || ''; let valB = b[sortKolomMaster] || ''; if (typeof valA === 'string') valA = valA.toLowerCase(); if (typeof valB === 'string') valB = valB.toLowerCase(); if (valA < valB) return sortAscMaster ? -1 : 1; if (valA > valB) return sortAscMaster ? 1 : -1; return 0; });
        ['nama', 'kemasan', 'varian', 'modal', 'jual', 'margin', 'minStok'].forEach(h => { const el = document.getElementById(`sort_${h}`); if(el) { if(sortKolomMaster === h) el.innerText = sortAscMaster ? ' 🔼' : ' 🔽'; else el.innerText = ''; } });
        let htmlRows = ''; dataTampil.forEach((p, i) => { let minS = p.minStok !== undefined ? p.minStok : 5; htmlRows += `<tr><td style="text-align:center;">${i+1}</td><td style="font-weight:bold; color:#292524; font-size:0.8rem;">${p.nama}</td><td style="color:#57534e; font-size:0.75rem;">${p.kemasan || '-'}</td><td style="color:#b45309; font-weight:bold; font-size:0.75rem;">${p.varian || '-'}</td><td>${formatRupiah(p.modal)}</td><td>${formatRupiah(p.jual)}</td><td style="color:#16a34a; font-weight:bold;">${formatRupiah(p.margin)}</td><td style="color:#b45309; font-weight:bold; text-align:center;">${minS}</td><td style="display:flex; gap:6px; padding-top:10px;"><button onclick="editProdukMaster(${p.originalIndex})" class="btn btn-warning" style="padding:4px 8px; font-size:0.7rem; margin:0;">✏️ Edit</button><button onclick="hapusProdukMaster(${p.originalIndex})" class="btn btn-danger" style="padding:4px 8px; font-size:0.7rem; margin:0;">🗑️ Hapus</button></td></tr>`; }); t.innerHTML = htmlRows; 
    }
    
    function editProdukMaster(i) { const p = masterProduk[i]; document.getElementById('editIndexProduk').value = i; document.getElementById('inputNamaProduk').value = p.nama; document.getElementById('inputKemasanProduk').value = p.kemasan || ''; document.getElementById('inputVarianProduk').value = p.varian || ''; document.getElementById('inputModalProduk').value = p.modal; document.getElementById('inputJualProduk').value = p.jual; document.getElementById('inputMinStokProduk').value = p.minStok !== undefined ? p.minStok : 5; hitungMarginForm(); document.getElementById('btnSimpanProduk').innerText = "Update Produk"; window.scrollTo(0, 0); }
    function hapusProdukMaster(i) { if(confirm("Yakin ingin menghapus produk ini dari Master Data?")){ masterProduk.splice(i,1); if(db) db.collection('appData').doc('masterProduk').set({list:masterProduk}); renderTabelMasterProduk(); } }
    function hapusProduk(i) { if(isDataLocked(document.getElementById('tglOps').value)) return; if(confirm("Sembunyikan produk ini hari ini?")) { const tgl = document.getElementById('tglOps').value; dbStok[tgl].splice(i,1); if(db) db.collection('stokHarian').doc(tgl).set({items: dbStok[tgl]}); renderTabelMatriks(); updateKalkulasi(); } }
    
    function renderDashboardGrafik() {
        const allDates = Object.keys(dbStok).filter(tgl => tgl.match(/^\d{4}-\d{2}-\d{2}$/)).sort(); const last7Dates = allDates.slice(-7); if(last7Dates.length === 0) return;
        let totalOmset = 0, totalProfit = 0; let labelsTren = [], dataOmset = [], dataProfitLine = [];
        last7Dates.forEach(tgl => {
            labelsTren.push(tgl.slice(-2) + '/' + tgl.slice(5,7)); let harianOmset = 0, harianProfitKotor = 0; let items = dbStok[tgl] || [];
            items.forEach(p => { const terjual = (p.terjual !== "" && p.terjual !== null && p.terjual !== undefined) ? parseFloat(p.terjual) : 0; if(terjual > 0) { harianOmset += (terjual * p.jual); harianProfitKotor += (terjual * p.margin); } });
            totalOmset += harianOmset; totalProfit += harianProfitKotor; dataOmset.push(harianOmset); dataProfitLine.push(harianProfitKotor);
        });
        document.getElementById('dashTotalOmset').innerText = formatRupiah(totalOmset); document.getElementById('dashTotalProfit').innerText = formatRupiah(totalProfit);
        Chart.register(ChartDataLabels); const formatSingkatan = function(value) { if (value === 0 || !value) return ''; if (value >= 1000000) { let j = value / 1000000; return (j % 1 === 0 ? j : j.toFixed(1).replace('.', ',')) + ' Jt'; } else if (value >= 1000) { let rb = value / 1000; return (rb % 1 === 0 ? rb : rb.toFixed(1).replace('.', ',')) + ' Rb'; } return value.toString(); };
        if(chartTren) chartTren.destroy(); const ctxTren = document.getElementById('chartTren').getContext('2d');
        chartTren = new Chart(ctxTren, { type: 'bar', data: { labels: labelsTren, datasets: [ { type: 'line', label: 'Profit Bersih', data: dataProfitLine, borderColor: '#16a34a', backgroundColor: '#16a34a', borderWidth: 2.5, tension: 0.3, pointRadius: 4, datalabels: { align: 'top', anchor: 'end', color: '#15803d', font: { weight: 'bold', size: 10 }, formatter: formatSingkatan } }, { type: 'bar', label: 'Omset Harian', data: dataOmset, backgroundColor: '#f59e0b', borderRadius: 4, datalabels: { color: '#ffffff', font: { weight: 'bold', size: 9 }, formatter: formatSingkatan } } ] }, options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 20 } }, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: {size: 10} } }, datalabels: { display: true } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, display: false } } } });
    }

    function generatePDFHarian() { 
        if (typeof html2pdf === 'undefined') return; const tgl = document.getElementById('tglOps').value; const isOwner = currentUser && currentUser.role === 'owner'; document.getElementById('pdfHrTitleProfit').style.display = isOwner ? 'block' : 'none'; document.getElementById('pdfHrBoxProfit').style.display = isOwner ? 'block' : 'none'; const pdfTHead = document.getElementById('pdfTHeadHarianBarang'); pdfTHead.innerHTML = `<tr><th>Produk</th><th style="text-align:center;">Laku</th><th style="text-align:right;">Omset</th>${isOwner ? '<th style="text-align:right;">Profit</th>' : ''}</tr>`; const kas = dbKasMasuk[tgl] || { cash: 0, qris: 0 }; const totalMasuk = (kas.cash||0)+(kas.qris||0); document.getElementById('pdfHariTgl').innerText = `Tanggal: ${tgl}`; document.getElementById('pdfHrCash').innerText = formatRupiah(kas.cash); document.getElementById('pdfHrQris').innerText = formatRupiah(kas.qris); document.getElementById('pdfHrTotalMasuk').innerText = formatRupiah(totalMasuk); let profitKotor = 0, uangModal = 0; const pdfTbody = document.getElementById('pdfTbodyHarianBarang'); pdfTbody.innerHTML = ''; 
        (dbStok[tgl] || []).forEach(p => { 
            const terjual = (p.terjual !== "" && p.terjual !== null && p.terjual !== undefined) ? parseFloat(p.terjual) : 0; 
            if (terjual > 0) { const o = terjual * p.jual; const pr = terjual * p.margin; profitKotor += pr; uangModal += (terjual * p.modal); const txtVarian = p.varian ? ` (${p.varian})` : ''; pdfTbody.innerHTML += `<tr><td><strong>${p.nama}</strong><small style="color:#78716c;">${txtVarian}</small><br><small style="color:#78716c;">${p.kemasan||''}</small></td><td style="text-align:center;">${terjual}</td><td style="text-align:right;">${formatRupiah(o)}</td>${isOwner ? `<td style="text-align:right;">${formatRupiah(pr)}</td>` : ''}</tr>`; } 
        }); 
        const basis = Math.max(0, profitKotor); document.getElementById('pdfHrModalBelanja').innerText = formatRupiah(uangModal); document.getElementById('pdfHrBersih').innerText = formatRupiah(profitKotor); document.getElementById('pdfHrPartner').innerText = formatRupiah(basis * 0.40); document.getElementById('pdfHrOwner').innerText = formatRupiah(basis * 0.60); const element = document.getElementById('pdfAreaHarian'); element.style.display = 'block'; html2pdf().set({ margin: 5, filename: `Kasir_Harian_${tgl}.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(element).save().then(() => { element.style.display = 'none'; }); 
    }
    
    function downloadTemplatePagi() { const tgl = document.getElementById('tglOps').value; let csv = 'Nama Dasar;Kemasan;Varian;Stok Awal;Tambah;Kurang;Stok Sisa\n'; (dbStok[tgl] || masterProduk).forEach(p => { csv += `${p.nama};${p.kemasan||''};${p.varian||''};${p.awal || 0};${p.tambah || 0};${p.kurang || 0};${p.sisa || ""}\n`; }); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); link.download = `Stok_Harian_${tgl}.csv`; link.click(); }
    
    function importStokPagi(event) { if(isDataLocked(document.getElementById('tglOps').value)) { alert("Data terkunci!"); return; } const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = function(e) { const tgl = document.getElementById('tglOps').value; if (!dbStok[tgl]) syncStokDenganMaster(tgl); e.target.result.split('\n').forEach((line, index) => { if (index === 0 || !line.trim()) return; const cols = line.split(';'); if (cols.length >= 4) { const idx = dbStok[tgl].findIndex(p => p.nama.toLowerCase() === cols[0].trim().toLowerCase() && (p.kemasan||'').toLowerCase() === cols[1].trim().toLowerCase() && (p.varian||'').toLowerCase() === cols[2].trim().toLowerCase()); if (idx !== -1) { dbStok[tgl][idx].awal = cols[3].trim(); if (cols[4]) dbStok[tgl][idx].tambah = cols[4].trim(); if (cols[5]) dbStok[tgl][idx].kurang = cols[5].trim(); if (cols[6]) dbStok[tgl][idx].sisa = cols[6].trim(); } } }); if(db) db.collection('stokHarian').doc(tgl).set({ items: dbStok[tgl] }).then(() => { renderTabelMatriks(); updateKalkulasi(); alert('✅ Import OK'); }); else { renderTabelMatriks(); updateKalkulasi(); alert('✅ Import Lokal OK'); } }; reader.readAsText(file); }
    
    function downloadTemplateMaster() { let csv = 'Nama Dasar;Kemasan;Varian;Modal;Jual\n'; masterProduk.forEach(p => { csv += `${p.nama};${p.kemasan||''};${p.varian||''};${p.modal};${p.jual}\n`; }); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); link.download = `Master_Produk_SoYou.csv`; link.click(); }
    
    function importMasterProduk(event) { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = function(e) { const lines = e.target.result.split('\n'); let itemDiperbarui = 0; let itemBaru = 0; lines.forEach((line, index) => { if (index === 0 || !line.trim()) return; const cols = line.split(';'); if (cols.length >= 5) { const nama = cols[0].trim(); const kemasan = cols[1].trim(); const varian = cols[2].trim(); const modal = parseFloat(cols[3].trim()) || 0; const jual = parseFloat(cols[4].trim()) || 0; const margin = jual - modal; if(nama) { const idx = masterProduk.findIndex(p => p.nama.toLowerCase() === nama.toLowerCase() && (p.kemasan||'').toLowerCase() === kemasan.toLowerCase() && (p.varian||'').toLowerCase() === varian.toLowerCase() ); if(idx !== -1) { masterProduk[idx].modal = modal; masterProduk[idx].jual = jual; masterProduk[idx].margin = margin; itemDiperbarui++; } else { masterProduk.push({ nama, kemasan, varian, modal, jual, margin }); itemBaru++; } } } }); if(itemDiperbarui > 0 || itemBaru > 0) { if(db) { db.collection('appData').doc('masterProduk').set({ list: masterProduk }).then(() => { renderTabelMasterProduk(); alert(`✅ Import Berhasil!\n\n${itemDiperbarui} Produk Diperbarui harganya\n${itemBaru} Produk Baru ditambahkan.`); }); } else { renderTabelMasterProduk(); alert(`✅ Import Lokal Berhasil!\n\n${itemDiperbarui} Produk Diperbarui\n${itemBaru} Produk Baru.`); } } else { alert("⚠️ Format CSV kosong atau tidak terbaca."); } event.target.value = ''; }; reader.readAsText(file); }
