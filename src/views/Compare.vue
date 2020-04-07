<template>
    <div>
        <div class="text-center">
            <div class="display-2 font-weight-black">COMPARE</div>
        </div>

        <countries-selection-input
            :selected-countries="selectedCountries"
            @countries-cleared="handleCountriesCleared"
            @country-added="handleCountryAdded"
            @country-removed="handleCountryRemoved"
        ></countries-selection-input>

        <div v-if="dataAdded">
            <v-row class="mb-3">
                <v-col
                    cols="12" lg="6"
                    v-for="(type,index) in chartTypes"
                    :key="index"
                >
                    <v-card>
                        <div class="title pl-4 pt-4 text-capitalize">{{ type }}</div>
                        <v-tabs centered>
                            <v-tab v-for="(chart, index) in Object.keys(charts)" :key="index">
                                {{ chart }}
                            </v-tab>

                            <v-tab-item
                                class="pa-4"
                                v-for="(chart, index) in Object.keys(charts)"
                                :key="index"
                            >
                                <historical-chart
                                    v-if="! loadingCharts"
                                    :chart-data="charts[chart]"
                                    :type="type"
                                ></historical-chart>
                            </v-tab-item>
                        </v-tabs>
                    </v-card>
                </v-col>
            </v-row>

            <v-card class="mb-8">
                <v-card-title class="pl-4">More information</v-card-title>
                <countries-data-table
                    :countries="countriesInfo"
                ></countries-data-table>
            </v-card>
        </div>
        <div v-else class="text-center grey--text mt-6">
            <v-icon size="100" color="grey">fas fa-globe-americas</v-icon>
            <div class="headline mt-6">Select countries to compare</div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import CountriesSelectionInput from '@/components/CountriesSelectionInput.vue';
import CountriesDataTable from '@/components/CountriesDataTable.vue';
import HistoricalChart from '@/components/HistoricalChart.vue';
import api from '@/api';

export default {
    name: 'Compare',

    components: {
        HistoricalChart,
        CountriesSelectionInput,
        CountriesDataTable
    },

    data: function () {
        return {
            dataAdded: false,
            selectedCountries: [],

            chartTypes: ['linear', 'logarithmic'],
            
            loadingCharts: false,
            charts: {
                cases: { labels: [], datasets: [] },
                recovered: { labels: [], datasets: [] },
                deaths: { labels: [], datasets: [] }
            },

            countriesInfo: [],

            colorPool: [
                { color: '#008000', country: null },
                { color: '#8b0000', country: null },
                { color: '#87cefa', country: null },
                { color: '#f08080', country: null },
                { color: '#bdb76b', country: null },
                { color: '#000080', country: null },
                { color: '#ff0000', country: null },
                { color: '#ff8c00', country: null },
                { color: '#7fff00', country: null },
                { color: '#00fa9a', country: null },
                { color: '#0000ff', country: null },
                { color: '#2f4f4f', country: null },
                { color: '#ff00ff', country: null },
                { color: '#1e90ff', country: null },
                { color: '#dda0dd', country: null },
                { color: '#ff1493', country: null },
                { color: '#fffff0', country: null },
                { color: '#ffd700', country: null },
                { color: '#00ffff', country: null }
            ]
        }
    },

    mounted () {
        this.$store.dispatch('fetch_countries_data');
        this.loadCountriesFromQueryString();
    },

    methods: {
        getColor: function (country) {
            const color = this.colorPool.find(c => c.country == country);

            if (color) {
                return color.color;
            } else {
                const availableColors = this.colorPool.filter(c => c.country == null);
                
                if (availableColors.length > 0) {
                    const color = availableColors[0].color;
                    this.colorPool.find(c => c.color == color).country = country;
                    return color;
                } else {
                    return this.getRandomColor();
                }
            }
        },

        getRandomColor: function () {
            var color = Math.floor(Math.random() * 16777216).toString(16);
            return '#000000'.slice(0, -color.length) + color;
        },

        loadChartData: async function (countryCode) {
            this.loadingCharts = true;

            const data = await api.getCountryHistorical(countryCode);

            const color = this.getColor(countryCode);
            Object.keys(this.charts).map(chart => {
                this.charts[chart].labels = Object.keys(data.timeline[chart]);
                this.charts[chart].datasets.push({
                    label: data.country,
                    data: Object.values(data.timeline[chart]),
                    fill: false,
                    borderColor: color,
                    pointBackgroundColor: color
                });
            });

            this.loadingCharts = false;
        },

        loadInfoData: function (countryCode) {
            const country = this.countries.data.find(c => c.countryInfo.iso2 == countryCode);
            this.countriesInfo.push({
                country: country.country,
                countryInfo: { flag: country.countryInfo.flag },
                cases: country.cases,
                casesPerOneMillion: country.casesPerOneMillion,
                critical: country.critical,
                recovered: country.recovered,
                deaths: country.deaths,
                deathsPerOneMillion: country.deathsPerOneMillion,
                tests: country.tests,
                testsPerOneMillion: country.testsPerOneMillion,
            });
        },

        loadCountriesFromQueryString: function () {
            const c = this.$route.query.c;
            const countries = c ? c.split(';') : [];
            countries.map(country => this.selectedCountries.push(country));
        },

        addCountryToQueryString: function (countryCode) {
            const c = this.$route.query.c;
            const countries = c ? c.split(';') : [];

            if (! countries.includes(countryCode)) {
                countries.push(countryCode);
                this.$router.push({
                    path: '/compare',
                    query: { c: countries.join(';') }
                });
            }
        },

        removeCountryFromQueryString: function (countryCode) {
            const c = this.$route.query.c;
            let countries = c ? c.split(';') : [];

            countries = countries.filter(c => c != countryCode);

            this.$router.push({
                path: '/compare',
                query: { c: countries.join(';') }
            });
        },

        handleCountriesCleared: function () {
            this.dataAdded = false;

            Object.keys(this.charts).map(chart => {
                this.charts[chart] = { labels: [], datasets: [] };
            });

            this.countriesInfo = [];
            this.colorPool.map(color => color.country = null);
            this.$router.push({ path: '/compare' });
        },

        handleCountryAdded: function (countryCode) {
            this.dataAdded = true;
            this.loadChartData(countryCode);
            this.loadInfoData(countryCode);
            this.addCountryToQueryString(countryCode);
        },

        handleCountryRemoved: function (countryCode) {
            const country = this.countries.data.find(c => c.countryInfo.iso2 == countryCode);

            Object.keys(this.charts).map(chart => {
                this.charts[chart].datasets = this.charts[chart].datasets.filter(d => d.label != country.country);
            });

            this.countriesInfo = this.countriesInfo.filter(c => c.country.name != country.country);

            this.removeCountryFromQueryString(countryCode);
        }
    },

    computed: {
        ...mapState(['countries'])
    }
}
</script>
