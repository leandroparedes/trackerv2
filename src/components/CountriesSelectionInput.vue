<template>
    <div>
        <v-autocomplete
            v-model="countriesData"
            :items="items"
            outlined
            small-chips
            clearable
            label="Choose countries to compare"
            multiple
            :search-input.sync="searchInput"
            @change="searchInput = ''"
            class="mt-8"
        >
            <template v-slot:selection="data">
                <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="handleRemove(data.item.value)"
                >{{ data.item.text }}</v-chip>
            </template>
        </v-autocomplete>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'CountriesSelectionInput',

    props: ['selected-countries'],

    data: function () {
        return {
            searchInput: '',
            countriesData: [],
            items: []
        }
    },

    mounted () {
        this.countriesData = this.selectedCountries;

        this.countries.data.map(country => {
            this.items.push({
                text: country.country,
                value: country.countryInfo.iso2
            });
        });
    },

    methods: {
        handleRemove: function (removed) {
            this.countriesData = this.countriesData.filter(c => c != removed);
        }
    },

    computed: {
        ...mapState(['countries'])
    },

    watch: {
        countriesData: function (newValues, oldValues) {
            if (newValues.length === 0) {
                this.$emit('countries-cleared');
                return;
            }

            if (newValues.length < oldValues.length) {
                const removedCountry = oldValues.filter(v => ! newValues.includes(v))[0];
                this.$emit('country-removed', removedCountry);
                return;
            }

            if (newValues.length - oldValues.length === 1) {
                const addedCountry = newValues.length > 0 ? newValues[newValues.length -1] : newValues[0];
                this.$emit('country-added', addedCountry);
                return;
            }

            if (newValues.length - oldValues.length > 1) {
                newValues.map(v => this.$emit('country-added', v));
                return;
            }
        }
    }
}
</script>
