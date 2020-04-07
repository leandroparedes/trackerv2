<template>
    <v-data-table
        :headers="headers"
        :items="countries"
        mobile-breakpoint="0"
    >
        <template v-slot:item.country="{ item }">
            <v-avatar size="18" class="mr-1">
                <img :src="item.countryInfo.flag">
            </v-avatar>
            {{ item.country }}
        </template>
        <template v-slot:item.cases="{ item }">
            <span class="text-center">
                {{ item.cases | formatNumber }}
            </span>
        </template>
        <template v-slot:item.casesPerOneMillion="{ item }">
            <div class="text-center">
                {{ item.casesPerOneMillion | formatNumber }}
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
        <template v-slot:item.deathsPerOneMillion="{ item }">
            <span class="text-center">
                {{ item.deathsPerOneMillion | formatNumber }}
            </span>
        </template>
        <template v-slot:item.tests="{ item }">
            <span class="text-center">
                {{ item.tests | formatNumber }}
            </span>
        </template>
        <template v-slot:item.testsPerOneMillion="{ item }">
            <span class="text-center">
                {{ item.testsPerOneMillion | formatNumber }}
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
                { text: 'Cases per million', value: 'casesPerOneMillion', align: 'center' },
                { text: 'Critical', value: 'critical', align: 'center' },
                { text: 'Recovered', value: 'recovered', align: 'center' },
                { text: 'Deaths', value: 'deaths', align: 'center' },
                { text: 'Deaths per million', value: 'deathsPerOneMillion', align: 'center' },
                { text: 'Tests', value: 'tests', align: 'center' },
                { text: 'Tests per million', value: 'testsPerOneMillion', align: 'center' },
            ]
        }
    }
}
</script>
