new Vue({
    el: '#app',

    data: {
        tab: 'stok',

        stok: [],
        tracking: [],
        upbjjList: [],
        kategoriList: [],
        paket: []
    },

    mounted() {

        fetch('data/dataBahanAjar.json')
            .then(res => res.json())
            .then(data => {
                const savedData =
                    localStorage.getItem('stokData');

                this.stok =
                    savedData
                        ? JSON.parse(savedData)
                        : data.stok;

                const savedTracking =
                    localStorage.getItem(
                        'trackingData'
                    );

                this.tracking =
                    savedTracking
                        ? JSON.parse(savedTracking)
                        : data.tracking;

                this.upbjjList = data.upbjjList;
                this.kategoriList = data.kategoriList;
                this.paket = data.paket;
            });
    }
});