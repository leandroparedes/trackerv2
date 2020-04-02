<template>
    <div v-if="global.loaded">
        <div class="text-center">
            <div class="display-2 font-weight-black">GLOBAL</div>
            <div class="title error--text mt-4">Affected countries: {{ global.totals.affectedCountries }}</div>
        </div>

        <v-row class="mt-4">
            <v-col cols="12" sm="6" lg="3">
                <info-card color="#424242">
                    <template v-slot:title>Cases</template>
                    <template v-slot:icon>fas fa-globe-americas</template>
                    <template v-slot:count-total>{{ global.totals.cases | formatNumber }}</template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#2196f3">
                    <template v-slot:title>Actives</template>
                    <template v-slot:icon>fas fa-head-side-mask</template>
                    <template v-slot:count-total>{{ global.totals.active | formatNumber }}</template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#4caf50">
                    <template v-slot:title>Recovered</template>
                    <template v-slot:icon>fas fa-heart</template>
                    <template v-slot:count-total>{{ global.totals.recovered |formatNumber }}</template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#ff5252">
                    <template v-slot:title>Deaths</template>
                    <template v-slot:icon>fas fa-skull-crossbones</template>
                    <template v-slot:count-total>{{ global.totals.deaths | formatNumber }}</template>
                </info-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" lg="6">
                <v-card class="pa-4">
                    <div class="title pb-2">Exponential</div>
                    <historical-chart :chart-data="historicalData" type="linear"></historical-chart>
                </v-card>
            </v-col>
            <v-col cols="12" lg="6">
                <v-card class="pa-4">
                    <div class="title pb-2">Logarithmic</div>
                    <historical-chart :chart-data="historicalData" type="logarithmic"></historical-chart>
                </v-card>
            </v-col>
        </v-row>

        <div class="text-center mt-4">
            <div class="primary--text">Last updated</div>
            <div class="grey--text">{{ new Date(global.totals.updated) }}</div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import InfoCard from '@/components/InfoCard.vue';
import HistoricalChart from '@/components/HistoricalChart.vue';

export default {
    name: 'Home',

    components: {
        InfoCard,
        HistoricalChart
    },

    mounted () {
        this.$store.dispatch('fetch_global_data');
    },

    computed: {
        ...mapState(['global']),

        historicalData: function () {
            let chartData = { labels: null, datasets: [] };

            chartData.labels = Object.keys(this.global.historical.cases);

            chartData.datasets.push({
                label: 'Cases',
                data: Object.values(this.global.historical.cases),
                fill: false,
                borderColor: '#707070',
                pointBackgroundColor: '#707070',
            });

            chartData.datasets.push({
                label: 'Recovered',
                data: Object.values(this.global.historical.recovered),
                fill: false,
                borderColor: '#4caf50',
                pointBackgroundColor: '#4caf50'
            });

            chartData.datasets.push({
                label: 'Deaths',
                data: Object.values(this.global.historical.deaths),
                fill: false,
                borderColor: '#ff5252',
                pointBackgroundColor: '#ff5252',
            });

            return chartData;
        }
    }
}
</script>
