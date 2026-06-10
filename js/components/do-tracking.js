Vue.component('do-tracking', {

    props: [
        'tracking',
        'paket'
    ],

    data() {
        return {
            searchDO: '',
            selectedStatus: '',

            showDetailModal: false,
            selectedTracking: null,
            selectedMahasiswa: null,
            selectedIndex: -1,
            showAddModal: false,
            errorMessage: '',

            newDO: {
                mahasiswa: null,
                nim: '',
                nama: '',
                ekspedisi: '',
                paket: '',
                tanggalKirim: ''
            },

            showDeleteModal: false,
            selectedDeleteIndex: -1,
            selectedDeleteDO: ''
        };
    },

    watch: {
        selectedStatus() {
            this.searchDO = '';
        },

        showAddModal(newValue) {
            if (newValue) {
                this.errorMessage = '';
            }
        }
    },
    computed: {
        filteredTracking() {
            let result = [...this.tracking];
            // Search Nomor DO
            if (this.searchDO) {
                result = result.filter(item =>
                    Object.keys(item)[0]
                        .toLowerCase()
                        .includes(
                            this.searchDO.toLowerCase()
                        )
                );
            }
            // Filter Status
            if (this.selectedStatus) {
                result = result.filter(item =>
                    Object.values(item)[0].status ===
                    this.selectedStatus
                );
            }
            return result;
        },

        totalDO() {
            return this.tracking.length;
        },

        totalDalamPerjalanan() {
            return this.tracking.filter(
                item =>
                    Object.values(item)[0].status ===
                    'Dalam Perjalanan'
            ).length;
        },

        totalSelesai() {
            return this.tracking.filter(
                item =>
                    Object.values(item)[0].status ===
                    'Selesai'
            ).length;
        },

        totalTertunda() {
            return this.tracking.filter(
                item =>
                    Object.values(item)[0].status ===
                    'Tertunda'
            ).length;
        },

        selectedPaket() {

            if (!this.paket)
                return null;

            return this.paket.find(
                item =>
                    item.kode ===
                    this.newDO.paket
            );

        }
    },

    methods: {
        showDetail(item, index) {
            const nomorDO =
                Object.keys(item)[0];
            const dataDO =
                Object.values(item)[0];
            this.selectedTracking = {
                nomorDO,
                ...dataDO
            };
            this.selectedIndex = index;
            this.showDetailModal = true;
        },

        closeDetail() {
            this.showDetailModal = false;
            this.selectedTracking = null;
            this.selectedIndex = -1;
        },

        submitSearch() {
            console.log('Mencari...');
        },

        cancelSearch() {
            this.searchDO = '';
        },

        generateDONumber() {
            const nomorBaru =
                this.tracking.length + 1;

            return 'DO2025-' +
                String(nomorBaru)
                    .padStart(4, '0');
        },

        openAddModal() {
            this.showAddModal = true;
        },

        closeAddModal() {
            this.showAddModal = false;
            this.errorMessage = '';
        },

        addDO() {
            console.log('simpan diklik');
            if (
                !this.newDO.nim ||
                !this.newDO.nama ||
                !this.newDO.ekspedisi ||
                !this.newDO.paket ||
                !this.newDO.tanggalKirim
            ) {
                this.errorMessage =
                    'Semua field wajib diisi';
                return;
            }

            const nomorDO =
                this.generateDONumber();

            const dataBaru = {
                [nomorDO]: {
                    nim: this.newDO.nim,
                    nama: this.newDO.nama,
                    status: 'Dalam Perjalanan',
                    ekspedisi:
                        this.newDO.ekspedisi,
                    tanggalKirim:
                        this.newDO.tanggalKirim,
                    paket:
                        this.newDO.paket,
                    total:
                        this.selectedPaket.harga,

                    perjalanan: [
                        {
                            waktu:
                                new Date()
                                    .toLocaleString(
                                        'id-ID'
                                    ),

                            keterangan:
                                'Delivery Order dibuat'
                        }
                    ]
                }
            };

            this.tracking.push(dataBaru);
            this.newDO = {
                nim: '',
                nama: '',
                ekspedisi: '',
                paket: '',
                tanggalKirim: ''
            };
            this.closeAddModal();
            this.saveTracking();
        },

        saveTracking() {

            localStorage.setItem(

                'trackingData',

                JSON.stringify(
                    this.tracking
                )

            );

        },

        formatRupiah(angka) {

            return 'Rp ' +
                Number(angka)
                    .toLocaleString('id-ID');

        },

        addProgress() {
            if (!this.newProgress)
                return;
            const nomorDO =
                this.selectedTracking.nomorDO;
            this.tracking[
                this.selectedIndex
            ][nomorDO]
                .perjalanan.push({
                    waktu:
                        new Date()
                            .toLocaleString(
                                'id-ID'
                            ),
                    keterangan:
                        this.newProgress
                });
            this.newProgress = '';
            this.saveTracking();
        },

        deleteDO(item, index) {
            this.selectedDeleteDO =
                Object.keys(item)[0];
            this.selectedDeleteIndex =
                index;
            this.showDeleteModal =
                true;
        },

        confirmDelete() {
            this.tracking.splice(
                this.selectedDeleteIndex,
                1
            );
            this.saveTracking();
            this.showDeleteModal =
                false;
        },

        cancelDelete() {
            this.showDeleteModal =
                false;
        }
    },

    template: `
<div>
    <div class="card">
        <h2>Tracking Delivery Order</h2>
        <div class="filter-container">
            <input
                v-model="searchDO"
                @keyup.enter="submitSearch"
                @keyup.esc="cancelSearch"
                placeholder="Cari Nomor DO">

            &nbsp;&nbsp;

            <select
                v-model="selectedStatus">
                <option value="">
                    Semua Status
                </option>
                <option value="Dalam Perjalanan">
                    Dalam Perjalanan
                </option>
                <option value="Selesai">
                    Selesai
                </option>
                <option value="Tertunda">
                    Tertunda
                </option>
            </select>
            
            <button @click="openAddModal">Tambah DO</button>

        </div>

        <div
        v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
            <div class="modal-content" @click.stop>
                <h3>
                    Tambah Delivery Order
                </h3>
                <p
                    v-if="errorMessage"
                    class="error-message">
                    {{ errorMessage }}
                </p>
                <input
                    v-model="newDO.nim"
                    placeholder="NIM">
                <input
                    v-model="newDO.nama"
                    placeholder="Nama">
                <select v-model="newDO.ekspedisi">
                    <option value="">
                        Pilih Ekspedisi
                    </option>
                    <option>
                        JNE
                    </option>
                    <option>
                        J&T
                    </option>
                    <option>
                        SiCepat
                    </option>
                    <option>
                        AnterAja
                    </option>
                </select>
                <select v-model="newDO.paket">
                    <option value="">
                        Pilih Paket
                    </option>
                    <option
                        v-for="item in paket"
                        :key="item.kode"
                        :value="item.kode">
                        {{ item.kode }}
                        -
                        {{ item.nama }}
                    </option>
                </select>
                <input
                    type="date"
                    v-model="newDO.tanggalKirim">
                <input
                    :value="
                        selectedPaket
                        ? formatRupiah(
                            selectedPaket.harga
                        )
                        : ''
                    "
                    readonly>
                <br><br>
                <div class="modal-actions">
                    <button class="btn-cancel"
                        @click="addDO">
                        Simpan
                    </button>
                    <button class="btn-delete"
                        @click="closeAddModal">
                        Batal
                    </button>
                </div>
            </div>
        </div>

        <div class="summary-container">
            <div class="summary-card">
                <h3>{{ totalDO }}</h3>
                <p>Total DO</p>
            </div>
            <div class="summary-card">
                <h3>{{ totalDalamPerjalanan }}</h3>
                <p>Dalam Perjalanan</p>
            </div>
            <div class="summary-card">
                <h3>{{ totalSelesai }}</h3>
                <p>Selesai</p>
            </div>
            <div class="summary-card">
                <h3>{{ totalTertunda }}</h3>
                <p>Tertunda</p>
            </div>
        </div>

        <br>

        <table>
            <thead>
                <tr>
                    <th>No DO</th>
                    <th>NIM</th>
                    <th>Nama</th>
                    <th>Status</th>
                    <th>Ekspedisi</th>
                    <th>Tanggal Kirim</th>
                    <th>Paket</th>
                    <th>Total</th>
                    <th>Aksi</th>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="(item,index) in filteredTracking"
                    :key="Object.keys(item)[0]">
                    <td>
                        {{ Object.keys(item)[0] }}
                    </td>
                    <td>
                        {{ Object.values(item)[0].nim }}
                    </td>
                    <td>
                        {{ Object.values(item)[0].nama }}
                    </td>
                    <td>
                        <tracking-status-badge
                            :status="
                                Object.values(item)[0].status
                            ">
                        </tracking-status-badge>
                    </td>
                    <td>
                        {{ Object.values(item)[0].ekspedisi }}
                    </td>
                    <td>
                        {{ Object.values(item)[0].tanggalKirim }}
                    </td>
                    <td>
                        {{ Object.values(item)[0].paket }}
                    </td>
                    <td>
                        Rp {{ Object.values(item)[0].total.toLocaleString('id-ID') }}
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-detail" @click="showDetail(item)">
                                Detail
                            </button>
                            <button class="btn-delete" @click="deleteDO(item,index)">
                                Hapus
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>  
    </div>

    <div
        v-if="showDetailModal"
        class="modal-overlay"
        @click="closeDetail">

        <div class="modal-content">
            @click.stop
            <h3>Detail Delivery Order</h3>
            <hr>
            <p>
                <strong>No DO :</strong>
                {{ selectedTracking.nomorDO }}
            </p>
            <p>
                <strong>NIM :</strong>
                {{ selectedTracking.nim }}
            </p>
            <p>
                <strong>Nama :</strong>
                {{ selectedTracking.nama }}
            </p>
            <p>
                <strong>Status :</strong>
                {{ selectedTracking.status }}
            </p>
            <p>
                <strong>Ekspedisi :</strong>
                {{ selectedTracking.ekspedisi }}
            </p>
            <p>
                <strong>Tanggal Kirim :</strong>
                {{ selectedTracking.tanggalKirim }}
            </p>
            <p>
                <strong>Paket :</strong>
                {{ selectedTracking.paket }}
            </p>
            <p>
                <strong>Total :</strong>
                Rp {{ selectedTracking.total.toLocaleString('id-ID') }}
            </p>
            <hr>
            <h4>
                Riwayat Perjalanan
            </h4>
            <ul>
                <li
                    v-for="
                    (perjalanan,index)
                    in selectedTracking.perjalanan"
                    :key="index">
                    <strong>
                        {{ perjalanan.waktu }}
                    </strong>
                    <br>
                    {{ perjalanan.keterangan }}
                </li>
            </ul>
            <button class="btn-delete"
                @click="closeDetail">
                Tutup
            </button>
        </div>
    </div>
    <div
        v-if="showDeleteModal"
        class="modal-overlay"
        @click="cancelDelete">
        <div
            class="modal-content"
            @click.stop>
            <h3>
                Konfirmasi Hapus
            </h3>
            <p>
                Yakin ingin menghapus
                <strong>
                    {{ selectedDeleteDO }}
                </strong> ?
            </p>
            <br>
            <div>
                <button
                    class="btn-cancel"
                    @click="cancelDelete">
                    Batal
                </button>
                <button
                    class="btn-delete"
                    @click="confirmDelete">
                    Hapus
                </button>
            </div>
        </div>
    </div>
</div>

`
});