<template>
    <div>
        <div class="text-center">
            <div class="display-2 font-weight-black">COMPARE</div>
        </div>

        <v-autocomplete
            v-model="values"
            :items="items"
            outlined
            chips
            small-chips
            clearable
            label="Choose countries to compare"
            multiple
            class="mt-8"
            :search-input.sync="searchInput"
            @change="searchInput=''"
        >
            <template v-slot:selection="data">
                <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="remove(data.item)"
                >{{ data.item }}</v-chip>
            </template>
        </v-autocomplete>

        <div v-if="values.length">
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

            <v-card>
                <v-card-title class="pl-4">More information</v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="countriesInfo"
                    class="mb-8"
                >
                    <template v-slot:item.country="{ item }">
                        <v-avatar size="18" class="mr-1">
                            <img :src="item.country.flag">
                        </v-avatar>
                        {{ item.country.name }}
                    </template>
                    <template v-slot:item.cases="{ item }">
                        <span class="text-center">
                            {{ item.cases | formatNumber }}
                        </span>
                    </template>
                    <template v-slot:item.casesPerMillion="{ item }">
                        <div class="text-center">
                            {{ item.casesPerMillion | formatNumber }}
                        </div>
                    </template>
                    <template v-slot:item.critical="{ item }">
                        <span class="text-center">
                            {{ item.critical | formatNumber }}
                        </span>
                    </template>
                    <template v-slot:item.recovered="{ item }">
                        <span class="text-center">
                            {{ item.recovered | formatNumber }}
                        </span>
                    </template>
                    <template v-slot:item.deaths="{ item }">
                        <span class="text-center">
                            {{ item.deaths | formatNumber }}
                        </span>
                    </template>
                    <template v-slot:item.deathsPerMillion="{ item }">
                        <span class="text-center">
                            {{ item.deathsPerMillion | formatNumber }}
                        </span>
                    </template>
                    <template v-slot:item.tests="{ item }">
                        <span class="text-center">
                            {{ item.tests | formatNumber }}
                        </span>
                    </template>
                    <template v-slot:item.testsPerMillion="{ item }">
                        <span class="text-center">
                            {{ item.testsPerMillion | formatNumber }}
                        </span>
                    </template>
                </v-data-table>
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
import HistoricalChart from '@/components/HistoricalChart.vue';

export default {
    name: 'Compare',

    components: { HistoricalChart },

    data: function () {
        return {
            searchInput: '',
            values: [],
            items: [],

            chartTypes: ['linear', 'logarithmic'],
            
            loadingCharts: false,
            charts: {
                cases: { labels: [], datasets: [] },
                recovered: { labels: [], datasets: [] },
                deaths: { labels: [], datasets: [] }
            },

            headers: [
                { text: 'Country', value: 'country', sortable: false },
                { text: 'Cases', value: 'cases', align: 'center' },
                { text: 'Cases per million', value: 'casesPerMillion', align: 'center' },
                { text: 'Critical', value: 'critical', align: 'center' },
                { text: 'Recovered', value: 'recovered', align: 'center' },
                { text: 'Deaths', value: 'deaths', align: 'center' },
                { text: 'Deaths per million', value: 'deathsPerMillion', align: 'center' },
                { text: 'Tests', value: 'tests', align: 'center' },
                { text: 'Tests per million', value: 'testsPerMillion', align: 'center' },
            ],
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
        const countries = this.$store.state.countries.data;
        countries.map(country => this.items.push(country.country));

        const queryString = this.$route.query.c;
        let countriesQueryString = queryString ? queryString.split(';') : [];
        countriesQueryString.map(country => {
            setTimeout(() => {
                this.values.push(country);
            }, 0)
        });
    },

    methods: {
        remove: function (country) {
            this.values = this.values.filter(v => v != country);
        },
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
        }
    },

    watch: {
        values: function (newValues, oldValues) {
            if (newValues.length === 0) {
                Object.keys(this.charts).map(chart => {
                    this.charts[chart] = { labels: [], datasets: [] };
                });
                
                this.countriesInfo = [];

                this.colorPool.map(color => {
                    color.country = null;
                });

                this.$router.push({
                    path: '/compare'
                });
            } else if (newValues.length < oldValues.length) {
                const removed = oldValues.filter(c => !newValues.includes(c))[0];

                Object.keys(this.charts).map(chart => {
                    this.charts[chart].datasets = this.charts[chart].datasets.filter(d => d.label != removed);
                });

                this.countriesInfo = this.countriesInfo.filter(c => c.country.name != removed);

                const queryString = this.$route.query.c;
                let countriesQueryString = queryString ? queryString.split(';') : [];
                countriesQueryString = countriesQueryString.filter(c => c != removed);
                this.$router.push({
                    path: '/compare',
                    query: { c: countriesQueryString.join(';') }
                });
            } else {
                this.loadingCharts = true;

                const lastAddedCountry = newValues.length > 0 ? newValues[newValues.length -1] : newValues[0];
                const historicalUrl = `https://corona.lmao.ninja/v2/historical/${lastAddedCountry}?lastdays=all`;

                const country = this.$store.state.countries.data.find(c => c.country == lastAddedCountry);

                this.countriesInfo.push({
                    country: {
                        name: country.country,
                        flag: country.countryInfo.flag
                    },
                    cases: country.cases,
                    casesPerMillion: country.casesPerOneMillion,
                    critical: country.critical,
                    recovered: country.recovered,
                    deaths: country.deaths,
                    deathsPerMillion: country.deathsPerOneMillion,
                    tests: country.tests,
                    testsPerMillion: country.testsPerOneMillion,
                });

                const queryString = this.$route.query.c;
                const countriesQueryString = queryString ? queryString.split(';') : [];
                if (! countriesQueryString.includes(lastAddedCountry)) {
                    countriesQueryString.push(lastAddedCountry);

                    this.$router.push({
                        path: '/compare',
                        query: { c: countriesQueryString.join(';') }
                    });
                }

                const color = this.getColor(lastAddedCountry);

                this.axios.get(historicalUrl).then(res => {
                    Object.keys(this.charts).map(chart => {
                        this.charts[chart].labels = Object.keys(res.data.timeline[chart]);
                        this.charts[chart].datasets.push({
                            label: res.data.country,
                            data: Object.values(res.data.timeline[chart]),
                            fill: false,
                            borderColor: color,
                            pointBackgroundColor: color
                        });
                    });
                }).finally(() => {
                    this.loadingCharts = false;
                });
            }
        }
    }
}
</script>

<style scoped>
    .no-wrap {
        white-space: nowrap
    }
</style>