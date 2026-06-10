Vue.component('ba-stock-table', {

    props: [
        'stocks',
        'upbjjList',
        'kategoriList'
    ],

    data() {
        return {

            selectedUpbjj: '',
            selectedKategori: '',
            onlyWarning: false,
            sortBy: 'judul',

            showFormModal: false,
            errorMessage: '',
            editMode: false,
            editIndex: -1,

            newStock: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                harga: '',
                qty: '',
                safety: ''
            },

            showDeleteModal: false,
            selectedDeleteIndex: -1,
            selectedDeleteKode: ''
        };

    },

    computed: {

        filteredStocks() {

            let result = [...this.stocks];

            // Filter UPBJJ
            if (this.selectedUpbjj) {
                result = result.filter(
                    item => item.upbjj === this.selectedUpbjj
                );
            }

            // Filter Kategori
            if (this.selectedKategori) {
                result = result.filter(
                    item => item.kategori === this.selectedKategori
                );
            }

            // Filter stok bermasalah
            if (this.onlyWarning) {
                result = result.filter(
                    item => item.qty < item.safety
                );
            }

            // Sorting
            switch (this.sortBy) {

                case 'judul':
                    result.sort(
                        (a, b) =>
                            a.judul.localeCompare(b.judul)
                    );
                    break;

                case 'harga':
                    result.sort(
                        (a, b) =>
                            a.harga - b.harga
                    );
                    break;

                case 'qty':
                    result.sort(
                        (a, b) =>
                            a.qty - b.qty
                    );
                    break;
            }

            return result;
        }

    },

    watch: {

        selectedUpbjj() {

            this.selectedKategori = '';

        },

        sortBy() {
            this.onlyWarning = false;
        },

        editMode() {
            this.errorMessage = '';
        }

    },

    methods: {

        resetFilter() {

            this.selectedUpbjj = '';
            this.selectedKategori = '';
            this.onlyWarning = false;
            this.sortBy = 'judul';

        },

        formatRupiah(angka) {

            return 'Rp ' +
                Number(angka)
                    .toLocaleString('id-ID');

        },

        addStock() {
            if (
                !this.newStock.kode ||
                !this.newStock.judul ||
                !this.newStock.kategori ||
                !this.newStock.upbjj ||
                !this.newStock.harga ||
                !this.newStock.qty ||
                !this.newStock.safety
            ) {
                this.errorMessage =
                    'Semua field wajib diisi!';
                return;
            }

            this.errorMessage = '';

            this.stocks.push({
                kode: this.newStock.kode,
                judul: this.newStock.judul,
                kategori: this.newStock.kategori,
                upbjj: this.newStock.upbjj,
                harga: Number(this.newStock.harga),
                qty: Number(this.newStock.qty),
                safety: Number(this.newStock.safety)
            });

            this.newStock = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                harga: '',
                qty: '',
                safety: ''
            };

            this.showFormModal = false;
            this.saveToLocalStorage();

        },

        deleteStock(item) {
            this.selectedDeleteKode =
                item.kode;
            this.selectedDeleteIndex =
                this.stocks.findIndex(
                    stock =>
                        stock.kode === item.kode
                );
            this.showDeleteModal = true;
        },

        confirmDeleteStock() {
            if (
                this.selectedDeleteIndex === -1
            ) return;
            this.stocks.splice(
                this.selectedDeleteIndex,
                1
            );
            this.saveToLocalStorage();
            this.showDeleteModal = false;
        },

        cancelDeleteStock() {
            this.showDeleteModal = false;
            this.selectedDeleteIndex = -1;
            this.selectedDeleteKode = '';
        },

        editStock(item) {

            this.newStock = {
                ...item
            };

            this.editMode = true;
            this.showFormModal = true;

            this.editIndex =
                this.stocks.findIndex(
                    stock =>
                        stock.kode === item.kode
                );

        },

        updateStock() {

            if (this.editIndex === -1)
                return;

            this.stocks.splice(
                this.editIndex,
                1,
                {
                    ...this.newStock
                }
            );

            this.cancelEdit();
            this.saveToLocalStorage();

        },

        cancelEdit() {
            this.editMode = false;
            this.editIndex = -1;
            this.errorMessage = '';
            this.showFormModal = false;
            this.newStock = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                harga: '',
                qty: '',
                safety: ''
            };
        },

        openModal() {
            this.errorMessage = '';
            this.showFormModal = true;
        },

        saveToLocalStorage() {

            localStorage.setItem(
                'stokData',
                JSON.stringify(this.stocks)
            );

        },

        openAddModal() {
            this.editMode = false;
            this.editIndex = -1;
            this.errorMessage = '';
            this.newStock = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                harga: '',
                qty: '',
                safety: ''
            };
            this.showFormModal = true;
        },
    },

    template: `

    <div class="card">
        <h2>Daftar Stok</h2>
        <div class="filter-container">

            <label>
                UPBJJ :
            </label>

            <select v-model="selectedUpbjj">
                <option value="">
                    Semua
                </option>
                <option
                    v-for="upbjj in upbjjList"
                    :key="upbjj"
                    :value="upbjj">
                    {{upbjj}}
                </option>
            </select>

            &nbsp;&nbsp;

            <label>
                Kategori :
            </label>

            <select v-model="selectedKategori">
                <option value="">
                    Semua
                </option>
                <option
                    v-for="kategori in kategoriList"
                    :key="kategori"
                    :value="kategori">
                    {{kategori}}
                </option>
            </select>

            &nbsp;&nbsp;

            <label class="checkbox-filter">
                <input
                    type="checkbox"
                    v-model="onlyWarning">
                Stok Bermasalah
            </label>

            &nbsp;&nbsp;

            <label>
                Sort :
            </label>

            <select v-model="sortBy">
                <option value="judul">
                    Judul
                </option>
                <option value="harga">
                    Harga
                </option>
                <option value="qty">
                    Qty
                </option>
            </select>

            &nbsp;&nbsp;

            <button
                @click="resetFilter">
                Reset
            </button>

            <button
                @click="openAddModal">
                Tambah
            </button>
        </div>

        <div
        v-if="showFormModal"
        class="modal-overlay"
        @click="showFormModal = false">

            <div class="modal" @click.stop>
                <h3> {{editMode ? 'Edit Bahan Ajar' : 'Tambah Bahan Ajar'}} </h3>
                <p
                    v-if="errorMessage"
                    class="error-message">
                    {{ errorMessage }}
                </p>

                <input
                    v-model="newStock.kode"
                    placeholder="Kode">

                <input
                    v-model="newStock.judul"
                    placeholder="Judul">

                <select
                    v-model="newStock.kategori">
                    <option value="">
                        Pilih Kategori
                    </option>
                    <option
                        v-for="kategori in kategoriList"
                        :key="kategori"
                        :value="kategori">
                        {{ kategori }}
                    </option>
                </select>
                <select
                    v-model="newStock.upbjj">
                    <option value="">
                        Pilih UPBJJ
                    </option>
                    <option
                        v-for="upbjj in upbjjList"
                        :key="upbjj"
                        :value="upbjj">
                        {{ upbjj }}
                    </option>
                </select>
                <input
                    type="number"
                    v-model="newStock.harga"
                    placeholder="Harga">
                <input
                    type="number"
                    v-model="newStock.qty"
                    placeholder="Qty">
                <input
                    type="number"
                    v-model="newStock.safety"
                    placeholder="Safety">
                <div class="modal-action">
                    <button
                        v-if="!editMode"
                        @click="addStock"
                        class="btn-cancel">
                        Simpan
                    </button>
                    <button
                        v-if="editMode"
                        @click="updateStock"
                        class="btn-cancel">
                        Update
                    </button>
                    <button
                        @click="showFormModal = false"
                        class="btn-delete">
                        Batal
                    </button>
                </div>
            </div>
        </div>

        <table border="1">
            <thead>
                <tr>
                    <th>Kode</th>
                    <th>Judul</th>
                    <th>Kategori</th>
                    <th>UPBJJ</th>
                    <th>Harga</th>
                    <th>Qty</th>
                    <th>Safety</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="item in filteredStocks"
                    :key="item.kode">
                    <td>
                        {{item.kode}}
                    </td>
                    <td>
                        {{item.judul}}
                    </td>
                    <td>
                        {{item.kategori}}
                    </td>
                    <td>
                        {{item.upbjj}}
                    </td>
                    <td>
                        {{formatRupiah(item.harga)}}
                    </td>
                    <td>
                        {{item.qty}} buah
                    </td>
                    <td>
                        {{item.safety}}
                    </td>
                    <td>
                        <status-badge
                            :qty="item.qty"
                            :safety="item.safety">
                        </status-badge>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit"
                                @click="editStock(item)">
                                Edit
                            </button>
                            <button class="btn-delete"
                                @click="deleteStock(item)">
                                Hapus
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div
            v-if="showDeleteModal"
            class="modal-overlay"
            @click="cancelDeleteStock">
            <div
                class="modal-content"
                @click.stop>
                <h3>
                    Hapus Bahan Ajar
                </h3>
                <p>
                    Yakin ingin menghapus
                    <strong>
                        {{ selectedDeleteKode }}
                    </strong> ?
                </p>
                <div class="action-buttons">
                    <button
                    class="btn-cancel"
                        @click="cancelDeleteStock">
                        Batal
                    </button>
                    <button
                        class="btn-delete"
                        @click="confirmDeleteStock">
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    </div>
    `

});