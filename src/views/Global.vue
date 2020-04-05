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
                    <template
                        v-if="global.totals.todayCases > 0"
                        v-slot:count-today
                    >
                        +{{ global.totals.todayCases | formatNumber }}
                    </template>
                    <template v-slot:additional-info>
                        <span class="error--text">
                            {{ global.totals.casesPerOneMillion | formatNumber }} per million
                        </span>
                    </template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#2196f3">
                    <template v-slot:title>Actives</template>
                    <template v-slot:icon>fas fa-head-side-mask</template>
                    <template v-slot:count-total>{{ global.totals.active | formatNumber }}</template>
                    <template v-slot:additional-info>
                        <span class="error--text">  {{ global.totals.critical | formatNumber }} in critical condition</span>
                    </template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#4caf50">
                    <template v-slot:title>Recovered</template>
                    <template v-slot:icon>fas fa-heart</template>
                    <template v-slot:count-total>{{ global.totals.recovered |formatNumber }}</template>
                    <template v-slot:additional-info>
                        <span class="success--text">
                            {{ Math.round((global.totals.recovered * 100) / global.totals.cases) }}% recovered
                        </span>
                    </template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#ff5252">
                    <template v-slot:title>Deaths</template>
                    <template v-slot:icon>fas fa-skull-crossbones</template>
                    <template v-slot:count-total>{{ global.totals.deaths | formatNumber }}</template>
                    <template
                        v-if="global.totals.todayDeaths > 0"
                        v-slot:count-today
                    >
                        +{{ global.totals.todayDeaths | formatNumber }}
                    </template>
                    <template v-slot:additional-info>
                        <span class="error--text">
                            {{ global.totals.deathsPerOneMillion | formatNumber }} per million
                        </span>
                    </template>
                </info-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <v-card class="pa-4">
                    <div class="title pb-2">Linear</div>
                    <historical-chart :chart-data="historicalData" type="linear"></historical-chart>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card class="pa-4">
                    <div class="title pb-2">Logarithmic</div>
                    <historical-chart :chart-data="historicalData" type="logarithmic"></historical-chart>
                </v-card>
            </v-col>
        </v-row>

        <div class="headline font-weight-black mt-8 mb-2 text-uppercase">
            Most affected countries
        </div>

        <v-row v-if="mostAffectedCountries" class="mb-8">
            <v-col
                cols="12" sm="6" md="3"
                v-for="(country, index) in mostAffectedCountries"
                :key="index"
            >
                <info-card @click.native="view(country.countryInfo.iso2)" style="cursor: pointer">
                    <template v-slot:title>{{ country.country }}</template>
                    <template v-slot:subtitle>Cases</template>
                    <template v-slot:count-total>{{ country.cases | formatNumber }}</template>
                    <template
                        v-if="country.todayCases"
                        v-slot:count-today
                    >
                        +{{ country.todayCases | formatNumber }}
                    </template>
                    <template
                        v-slot:additional-info
                        v-if="global.totals.cases > 0"
                    >
                        <span class="error--text">
                            {{ Math.round((country.cases * 100) / global.totals.cases) }}% of world total cases
                        </span>
                    </template>
                </info-card>
            </v-col>
        </v-row>

        <div class="text-center mt-4 mb-8">
            <div class="primary--text mb-1">Last updated {{ global.totals.updated | moment('from', 'now') }}</div>
            <div class="grey--text">{{ new Date(global.totals.updated) }}</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
        this.$store.dispatch('fetch_countries_data');
    },

    methods: {
        view: function (countryCode) {
            this.$router.push({
                name: 'ViewCountry',
                params: { countryCode: countryCode }
            });
        }
    },

    computed: {
        ...mapState(['global']),

        ...mapGetters(['mostAffectedCountries']),

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
