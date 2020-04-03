<template>
    <div v-if="timeline.loaded">
        <div class="text-center">
            <div class="display-2 font-weight-black">TIMELINE</div>
        </div>

        <v-timeline
            :dense="$vuetify.breakpoint.mdAndDown"
            class="mt-8"
        >
            <v-timeline-item
                v-for="(situation, index) in timeline.data"
                :key="index"
            >
                <template v-slot:opposite>
                    <highlights :highlights="situation.highlights"></highlights>
                </template>
                <situation-card :situation="situation"></situation-card>
            </v-timeline-item>
        </v-timeline>
    </div>
    <v-overlay v-else :value="! timeline.loaded">
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

    mounted () {
        this.$store.dispatch('fetch_timeline_data');
    },

    computed: {
        ...mapState(['timeline'])
    }
}
</script>