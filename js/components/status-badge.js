Vue.component('status-badge', {

    props: ['qty', 'safety'],

    template: `

    <span>

        <span
            v-if="qty==0"
            class="badge badge-danger">

            Kosong

        </span>

        <span
            v-else-if="qty < safety"
            class="badge badge-warning">

            Menipis

        </span>

        <span
            v-else
            class="badge badge-success">

            Aman

        </span>

    </span>

    `
});