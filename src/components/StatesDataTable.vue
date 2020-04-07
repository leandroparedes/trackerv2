<template>
    <v-data-table
        :headers="headers"
        :items="states"
        :search="search"
        mobile-breakpoint="0"
    >
        <template v-slot:item.state="{ item }">
            {{ item.state }}
        </template>
        <template v-slot:item.active="{ item }">
            <span class="text-center">
                {{ item.active | formatNumber }}
            </span>
        </template>
        <template v-slot:item.cases="{ item }">
            <span class="text-center">
                {{ item.cases | formatNumber }}
            </span>
        </template>
        <template v-slot:item.todayCases="{ item }">
            <span class="text-center">
                {{ item.todayCases | formatNumber }}
            </span>
        </template>
        <template v-slot:item.deaths="{ item }">
            <span class="text-center">
                {{ item.deaths | formatNumber }}
            </span>
        </template>
        <template v-slot:item.todayDeaths="{ item }">
            <span class="text-center">
                {{ item.todayDeaths | formatNumber }}
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
    name: 'StatesDataTable',

    props: ['states', 'search'],

    data: function () {
        return {
            headers: [
                { text: 'State', value: 'state', sortable: false },
                { text: 'Active cases', value: 'active'},
                { text: 'Cases', value: 'cases', align: 'center' },
                { text: 'Today cases', value: 'todayCases', align: 'center' },
                { text: 'Deaths', value: 'deaths', align: 'center' },
                { text: 'Today deaths', value: 'todayDeaths', align: 'center' },
                { text: 'Tests', value: 'tests', align: 'center' },
                { text: 'Tests per million', value: 'testsPerOneMillion', align: 'center' },
            ]
        }
    }
}
</script>

<style>

</style>