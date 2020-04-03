<template>
    <v-simple-table
        v-if="numbers"
        class="mt-3"
    >
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">Location</th>
                    <th class="text-left">Confirmed</th>
                    <th class="text-left">Suspected</th>
                    <th class="text-left">Severe</th>
                    <th class="text-left">Deaths</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in numbers" :key="index">
                    <td>{{ item.location }}</td>
                    <td v-if="item.numbers.confirmed" class="text-center">
                        {{ item.numbers.confirmed | formatNumber }}
                    </td>
                    <td v-else class="text-center" title="Unreported">
                        <v-icon small>far fa-question-circle</v-icon>
                    </td>

                    <td v-if="item.numbers.suspected" class="text-center">
                        {{ item.numbers.suspected | formatNumber }}
                    </td>
                    <td v-else class="text-center" title="Unreported">
                        <v-icon small color="grey">far fa-question-circle</v-icon>
                    </td>

                    <td v-if="item.numbers.severe" class="text-center">
                        {{ item.numbers.severe | formatNumber }}
                    </td>
                    <td v-else class="text-center" title="Unreported">
                        <v-icon small color="grey">far fa-question-circle</v-icon>
                    </td>

                    <td v-if="item.numbers.deaths" class="text-center">
                        {{ item.numbers.deaths | formatNumber }}
                    </td>
                    <td v-else class="text-center" title="Unreported">
                        <v-icon small color="grey">far fa-question-circle</v-icon>
                    </td>
                </tr>
            </tbody>
      </template>
    </v-simple-table>
    <div v-else class="text-center">
        <div class="subtitle-1 font-weight-light pt-8 pb-5">
            There is no data available in this report.
        </div>
    </div>
</template>

<script>
export default {
    name: 'SituationInNumbers',

    props: ['numbers']
}
</script>
