<template>
    <v-card>
        <v-card-title
            class="headline primary--text text-capitalize d-flex justify-space-between"
        >
            <div>{{ situation.date | moment('dddd, MMMM Do YYYY') }}</div>
            <div>
                <a
                    v-if="situation.original_report_link"
                    :href="situation.original_report_link"
                    target="_blank"
                    title="Go to the original report"
                >
                    <v-icon size="16" color="primary">fas fa-external-link-alt</v-icon>
                </a>
            </div>
        </v-card-title>
        <v-card-subtitle class="pt-1 pb-0 caption text-capitalize">
            {{ situation.date | moment('from', 'now') }}
        </v-card-subtitle>
        <v-card-text class="mt-3">
            <v-tabs grow centered show-arrows>
                <v-tab title="Reports">
                    <v-icon>fas fa-file-alt</v-icon>
                </v-tab>
                <v-tab title="Preparedness and responses">
                    <v-icon>fas fa-shield-virus</v-icon>
                </v-tab>
                <v-tab title="Related links">
                    <v-icon>fas fa-link</v-icon>
                </v-tab>
                <v-tab title="Situation in numbers">
                    <v-icon>fas fa-table</v-icon>
                </v-tab>

                <v-tab-item>
                    <reports :reports="situation.reports"></reports>
                </v-tab-item>
                <v-tab-item>
                    <preparedness-and-responses
                        :actions="situation.preparedness_and_responses"
                    ></preparedness-and-responses>
                </v-tab-item>
                <v-tab-item>
                    <related-links :links="situation.related_links"></related-links>
                </v-tab-item>
                <v-tab-item>
                    <situation-in-numbers
                        :numbers="situation.situation_in_numbers"
                    ></situation-in-numbers>
                </v-tab-item>
            </v-tabs>
        </v-card-text>
    </v-card>
</template>

<script>
import Reports from './Reports.vue';
import PreparednessAndResponses from './PreparednessAndResponses.vue';
import RelatedLinks from './RelatedLinks.vue';
import SituationInNumbers from './SituationInNumbers.vue';

export default {
    name: 'SituationCard',

    props: ['situation'],

    components: {
        Reports,
        PreparednessAndResponses,
        RelatedLinks,
        SituationInNumbers
    }
}
</script>