<template>
    <div v-if="countries.loaded">
        <div class="text-center">
            <div class="display-2 font-weight-black">SEARCH</div>
        </div>

        <v-text-field
            v-model="searchInput"
            outlined
            label="Search country"
            class="mt-8"
        ></v-text-field>

        <div v-if="searchInput">
            <div class="title mb-4">
                Searching <span class="primary--text">{{ searchInput }}</span>
            </div>
            <v-row>
                <v-col
                    cols="12" sm="6" lg="3"
                    v-for="(country, index) in filteredCountries"
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
                    </info-card>
                </v-col>
            </v-row>
        </div>
        <div v-else-if="searchedCountries.length > 0">
            <div class="headline font-weight-black mt-2 mb-2 text-uppercase">
                Recently searched countries
            </div>
            <div class="d-flex flex-row-reverse">
                <v-btn
                    text
                    color="primary"
                    small
                    @click="clearSearched"
                >
                    Clear
                </v-btn>
            </div>
            <v-row>
                <v-col
                    cols="12" sm="6" lg="3"
                    v-for="(country, index) in searchedCountries"
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
                    </info-card>
                </v-col>
            </v-row>
        </div>
        <div v-else class="text-center grey--text mt-6">
            <v-icon size="100" color="grey">fas fa-globe-americas</v-icon>
            <div class="headline mt-6">Search for a country</div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import InfoCard from '@/components/InfoCard.vue';
import services from '@/services';

export default {
    name: 'Search',

    components: { InfoCard },

    data: function () {
        return {
            searchInput: '',
            filteredCountries: [],
            searchedCountries: []
        }
    },

    mounted () {
        this.$store.dispatch('fetch_countries_data');

        const searched = services.getSearched();

        searched.map(country => {
            this.searchedCountries.push(
                this.countries.data.find(c => c.countryInfo.iso2 == country.countryCode)
            );
        });
    },

    methods: {
        view: function (countryCode) {
            services.saveSearched(countryCode);

            this.$router.push({
                name: 'ViewCountry',
                params: { countryCode: countryCode }
            });
        },
        
        clearSearched: function () {
            services.clearSearched();
            this.searchedCountries = [];
        }
    },

    computed: {
        ...mapState(['countries'])
    },

    watch: {
        searchInput: function (value) {
            if (value.length === 0) {
                this.filteredCountries = [];
            } else {
                this.filteredCountries = this.countries.data.filter(country => {
                    return country.country.toLowerCase().includes(value.toLowerCase());
                });
            }
        }
    }
}
</script>
