<template>
    <v-data-table
        :headers="headers"
        :items="countries"
        :items-per-page="$vuetify.breakpoint.mdAndDown ? 1 : 10"
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
</template>

<script>
export default {
    name: 'CountriesDataTable',

    props: ['countries'],

    data: function () {
        return {
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
            ]
        }
    }
}
</script>
