Vue.component('tracking-status-badge', {

    props: ['status'],

    computed: {

        badgeClass() {

            switch (this.status) {

                case 'Selesai':
                    return 'tracking-success';

                case 'Dalam Perjalanan':
                    return 'tracking-warning';

                case 'Tertunda':
                    return 'tracking-danger';

                default:
                    return '';
            }
        }

    },

    template: `
        <span
            class="tracking-badge"
            :class="badgeClass">
            {{ status }}
        </span>
    `
});