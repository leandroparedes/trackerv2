<template>
    <div v-if="loaded">
        <div class="text-center">
            <div class="display-2 font-weight-black text-uppercase">
                <v-avatar size="42" class="mb-2 mr-1">
                    <img :src="country.info.countryInfo.flag">
                </v-avatar>
                {{ country.info.country }}
            </div>
            <div class="title grey--text font-weight-bold text-uppercase mt-2">
                Population: {{ country.info.population | formatNumber }}
            </div>
        </div>

        <v-row class="mt-3">
            <v-col cols="12" sm="6" lg="3">
                <info-card color="#424242">
                    <template v-slot:title>Cases</template>
                    <template v-slot:icon>fas fa-globe-americas</template>
                    <template v-slot:count-total>{{ country.info.cases | formatNumber }}</template>
                    <template
                        v-if="country.info.todayCases"
                        v-slot:count-today
                    >
                        +{{ country.info.todayCases | formatNumber }}
                    </template>
                    <template v-slot:additional-info>
                        <span class="error--text">
                            {{ country.info.casesPerOneMillion | formatNumber }} per million
                        </span>
                        <span class="font-weight-bold mx-1">&middot;</span>
                        <span class="info--text">
                            {{ country.info.tests | formatNumber }} tested
                        </span>
                    </template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#2196f3">
                    <template v-slot:title>Actives</template>
                    <template v-slot:icon>fas fa-head-side-mask</template>
                    <template v-slot:count-total>{{ country.info.active | formatNumber }}</template>
                    <template v-slot:additional-info>
                        <span class="error--text">  {{ country.info.critical | formatNumber }} in critical condition</span>
                    </template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#4caf50">
                    <template v-slot:title>Recovered</template>
                    <template v-slot:icon>fas fa-heart</template>
                    <template v-slot:count-total>{{ country.info.recovered |formatNumber }}</template>
                    <template v-slot:additional-info>
                        <span class="success--text">
                            {{ Math.round((country.info.recovered * 100) / country.info.cases) }}% recovered
                        </span>
                    </template>
                </info-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <info-card color="#ff5252">
                    <template v-slot:title>Deaths</template>
                    <template v-slot:icon>fas fa-skull-crossbones</template>
                    <template v-slot:count-total>{{ country.info.deaths | formatNumber }}</template>
                    <template
                        v-if="country.info.todayDeaths"
                        v-slot:count-today
                    >
                        +{{ country.info.todayDeaths | formatNumber }}
                    </template>
                    <template v-slot:additional-info>
                        <span class="error--text">
                            {{ country.info.deathsPerOneMillion | formatNumber }} per million
                        </span>
                    </template>
                </info-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" lg="6">
                <v-card class="pa-4">
                    <div class="title pb-2">Linear</div>
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

        <div class="text-center mt-4 mb-8">
            <div class="primary--text mb-1">Last updated {{ country.info.updated | moment('from', 'now') }}</div>
            <div class="grey--text">{{ new Date(country.info.updated) }}</div>
        </div>
    </div>
</template>

<script>
import InfoCard from '@/components/InfoCard.vue';
import HistoricalChart from '@/components/HistoricalChart.vue';

export default {
    name: 'ViewCountry',

    components: { InfoCard, HistoricalChart },

    data: function () {
        return {
            loaded: false,
            country: {
                info: {},
                historical: {}
            }
        }
    },

    mounted () {
        this.loaded = false;

        const countryCode = this.$route.params.countryCode;
        const infoUrl = this.axios.get(`https://corona.lmao.ninja/countries/${countryCode}`);
        const historicalUrl =  this.axios.get(`https://corona.lmao.ninja/v2/historical/${countryCode}?lastdays=all`);
        const populationUrl = this.axios.get(`https://restcountries.eu/rest/v2/alpha/${countryCode}?fields=population`);

        this.axios.all([infoUrl, historicalUrl, populationUrl]).then(this.axios.spread((info, historical, population) => {
            this.country.info = info.data;
            this.country.historical = historical.data;
            this.country.info.population = population.data.population;
        })).finally(() => this.loaded = true);
    },

    computed: {
        historicalData: function () {
            let chartData = { labels: null, datasets: [] };

            chartData.labels = Object.keys(this.country.historical.timeline.cases);

            chartData.datasets.push({
                label: 'Cases',
                data: Object.values(this.country.historical.timeline.cases),
                fill: false,
                borderColor: '#707070',
                pointBackgroundColor: '#707070',
            });

            chartData.datasets.push({
                label: 'Recovered',
                data: Object.values(this.country.historical.timeline.recovered),
                fill: false,
                borderColor: '#4caf50',
                pointBackgroundColor: '#4caf50'
            });

            chartData.datasets.push({
                label: 'Deaths',
                data: Object.values(this.country.historical.timeline.deaths),
                fill: false,
                borderColor: '#ff5252',
                pointBackgroundColor: '#ff5252',
            });

            return chartData;
        }
    }
}
</script>