<template>
    <div v-if="countries.loaded">
        <div class="text-center">
            <div class="overline">Region</div>
            <div class="display-2 font-weight-black text-uppercase">
                {{ $route.params.region }}
            </div>
        </div>

        <v-row class="mt-6">
            <v-col cols="12" sm="6" lg="3">
                <info-card color="#424242">
                    <template v-slot:title>Cases</template>
                    <template v-slot:icon>fas fa-globe-americas</template>
                    <template v-slot:count-total>{{ cases | formatNumber }}</template>
                    <template
                        v-if="todayCases > 0"
                        v-slot:count-today
                    >
                        +{{ todayCases | formatNumber }}
                    </template>
                    <template v-slot:additional-info>
                        <span class="info--text">
                            {{ tests | formatNumber }} tested
                        </span>
                    </template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#2196f3">
                    <template v-slot:title>Actives</template>
                    <template v-slot:icon>fas fa-head-side-mask</template>
                    <template v-slot:count-total>{{ active | formatNumber }}</template>
                    <template v-slot:additional-info>
                        <span class="error--text">
                            {{ critical | formatNumber }} in critical condition
                        </span>
                    </template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#4caf50">
                    <template v-slot:title>Recovered</template>
                    <template v-slot:icon>fas fa-heart</template>
                    <template v-slot:count-total>{{ recovered |formatNumber }}</template>
                    <template v-slot:additional-info>
                        <span class="success--text">
                            {{ Math.round((recovered * 100) / cases) }}% recovered
                        </span>
                    </template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#ff5252">
                    <template v-slot:title>Deaths</template>
                    <template v-slot:icon>fas fa-skull-crossbones</template>
                    <template v-slot:count-total>{{ deaths | formatNumber }}</template>
                    <template
                        v-if="todayDeaths > 0"
                        v-slot:count-today
                    >
                        +{{ todayDeaths | formatNumber }}
                    </template>
                    <template v-slot:additional-info>
                        <span class="error--text">
                            {{ Math.round((deaths * 100) / cases) }}% of total infected
                        </span>
                    </template>
                </info-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <v-card class="pa-4">
                    <div class="title pb-2">Linear</div>
                    <historical-chart
                        v-if="chartLoaded"
                        :chart-data="historicalData"
                        type="linear"
                    ></historical-chart>
                    <div v-else class="d-flex justify-center align-center" style="height: 50vh;">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                        ></v-progress-circular>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card class="pa-4">
                    <div class="title pb-2">Logarithmic</div>
                    <historical-chart
                        v-if="chartLoaded"
                        :chart-data="historicalData"
                        type="logarithmic"
                    ></historical-chart>
                    <div v-else class="d-flex justify-center align-center" style="height: 50vh;">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                        ></v-progress-circular>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <div class="d-md-flex justify-space-between mt-8 mb-6">
            <div class="headline font-weight-black text-uppercase">Countries</div>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                clearable
                class="my-4 pt-0 my-md-0"
            ></v-text-field>
        </div>
        <v-card class="mb-8">
            <countries-data-table
                v-if="countries.loaded"
                :countries="regionCountries"
                :search="search"
                @click-row="handleClickRow"
            ></countries-data-table>
        </v-card>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import InfoCard from '@/components/InfoCard.vue';
import CountriesDataTable from '@/components/CountriesDataTable.vue';
import historicalChart from '@/components/HistoricalChart.vue';

export default {
    name: 'ViewRegion',

    components: {
        InfoCard,
        CountriesDataTable,
        historicalChart
    },

    data: function () {
        return {
            search: '',
            regionCountries: [],
            cases: 0,
            todayCases: 0,
            active: 0,
            critical: 0,
            recovered: 0,
            deaths: 0,
            todayDeaths: 0,
            tests: 0,

            historicalCases: {},
            historicalRecovered: {},
            historicalDeaths: {},
            chartLoaded: false
        }
    },

    mounted () {
        this.chartLoaded = false;
        this.$store.dispatch('fetch_countries_data');
    },

    methods: {
        handleClickRow: function (countryCode) {
            this.$router.push({
                name: 'ViewCountry',
                params: { countryCode: countryCode }
            });
        }
    },

    computed: {
        ...mapState(['countries']),

        historicalData: function () {
            let chartData = { labels: null, datasets: [] };

            chartData.labels = Object.keys(this.historicalCases);

            chartData.datasets.push({
                label: 'Cases',
                data: Object.values(this.historicalCases),
                fill: false,
                borderColor: '#707070',
                pointBackgroundColor: '#707070',
            });

            chartData.datasets.push({
                label: 'Recovered',
                data: Object.values(this.historicalRecovered),
                fill: false,
                borderColor: '#4caf50',
                pointBackgroundColor: '#4caf50'
            });

            chartData.datasets.push({
                label: 'Deaths',
                data: Object.values(this.historicalDeaths),
                fill: false,
                borderColor: '#ff5252',
                pointBackgroundColor: '#ff5252',
            });

            return chartData;
        }
    },

    watch: {
        'countries.loaded': function () {
            if (this.countries.loaded) {
                const regions = require('../../regions.json');
                const region = regions.find(r => r.name.toLowerCase() == this.$route.params.region.toLowerCase());
                if (region) {
                    region.codes.map(code => {
                        const country = this.countries.data.find(c => c.countryInfo.iso2 == code);
                        if (country) {
                            this.cases += country.cases;
                            this.todayCases += country.todayCases;
                            this.active += country.active;
                            this.critical += country.critical;
                            this.recovered += country.recovered;
                            this.deaths += country.deaths;
                            this.todayDeaths += country.todayDeaths;
                            this.tests += country.tests;

                            this.regionCountries.push(country);
                        }
                    });

                    this.regionCountries = this.regionCountries.sort((a, b) => {
                        return b.cases - a.cases;
                    });

                    let countries = region.codes.join(',');

                    const url = `https://corona.lmao.ninja/v2/historical/${countries}?lastdays=all`;

                    this.axios.get(url).then(res => {
                        const countriesData = res.data.filter(c => c.country);
                        countriesData.map(c => {
                            Object.keys(c.timeline.cases).map(d => {
                                this.historicalCases[d] = (this.historicalCases[d] || 0) + c.timeline.cases[d];
                            });

                            Object.keys(c.timeline.recovered).map(r => {
                                this.historicalRecovered[r] = (this.historicalRecovered[r] || 0) + c.timeline.recovered[r];
                            });

                            Object.keys(c.timeline.deaths).map(d => {
                                this.historicalDeaths[d] = (this.historicalDeaths[d] || 0) + c.timeline.deaths[d];
                            });
                        });
                    }).finally(() => this.chartLoaded = true);
                } else {
                    this.$router.push('/global');
                }
            }
        }
    }
}
</script>
