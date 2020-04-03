<template>
    <div v-if="! loading">
        <div class="text-center">
            <div class="display-2 font-weight-black">TIMELINE</div>
        </div>

        <v-timeline
            :dense="$vuetify.breakpoint.mdAndDown"
            class="mt-8"
        >
            <v-timeline-item
                v-for="(situation, index) in situations.data"
                :key="index"
            >
                <template v-slot:opposite>
                    <highlights :highlights="situation.highlights"></highlights>
                </template>
                <situation-card :situation="situation"></situation-card>
            </v-timeline-item>
        </v-timeline>

        <div
            v-if="situations.links && situations.links.next"
            class="text-center"
        >
            <v-btn
                @click="loadMore"
                :loading="loadingMore"
                text
                x-large
            >
                Load more
            </v-btn>
        </div>
    </div>
    <v-overlay v-else :value="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
</template>

<script>
import { mapState } from 'vuex';
import SituationCard from '@/components/timeline/SituationCard.vue';
import Highlights from '@/components/timeline/Highlights.vue';

export default {
    name: 'Timeline',

    components: { SituationCard, Highlights },

    data: function () {
        return {
            loading: false,
            situations: [],
            loadingMore: false
        }
    },

    mounted () {
        this.loading = true;

        const url = 'https://covid-situations.herokuapp.com/v1/situations?page=1&perPage=10';

        this.axios.get(url).then(res => {
            this.situations = res.data;
        }).finally(() => this.loading = false);
    },

    methods: {
        loadMore: async function () {
            this.loadingMore = true;

            this.axios.get(this.situations.links.next).then(res => {
                res.data.data.map(situation => {
                    this.situations.data.push(situation);
                });
                this.situations.links.next = res.data.links.next;
            }).finally(() => this.loadingMore = false);
        },
    }
}
</script>