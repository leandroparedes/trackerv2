<template>
    <div v-if="countries.loaded">
        <div class="text-center">
            <div class="overline">Region</div>
            <div class="display-2 font-weight-black text-uppercase">
                {{ $route.params.region }}
            </div>
        </div>

        <v-row class="mt-6 mb-8">
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

        <div class="d-md-flex justify-space-between mb-6">
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

export default {
    name: 'ViewRegion',

    components: {
        InfoCard,
        CountriesDataTable
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
            tests: 0
        }
    },

    mounted () {
        this.$store.dispatch('fetch_countries_data');

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
        } else {
            this.$router.push('/global');
        }
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
        ...mapState(['countries'])
    }
}
</script>
