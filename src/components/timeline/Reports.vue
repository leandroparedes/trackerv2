<template>
    <div>
        <v-list dense>
            <v-subheader>REPORTS</v-subheader>
            <v-list-item
                v-for="(report, index) in slicedReports"
                :key="index"
            >
                <v-list-item-content>
                    {{ report }}
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <div v-if="reports.length > this.showCount" class="text-center">
            <v-btn
                text
                color="primary"
                @click="toggleShow"
            >
                {{ isShowingMore ? 'Show less' : 'Show more' }}
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Reports',

    props: ['reports'],

    data: function () {
        return {
            slicedReports: [],
            showCount: 2,
            isShowingMore: false
        }
    },

    mounted () {
        this.slicedReports = this.reports.slice(0, this.showCount);
    },

    methods: {
        toggleShow: function () {
            if (this.slicedReports.length === this.reports.length) {
                this.slicedReports = this.reports.slice(0, this.showCount);
                this.isShowingMore = false;
                //this.$emit('scroll-to-top');
            } else {
                this.slicedReports = this.reports;
                this.isShowingMore = true;
            }
        }
    }
}
</script>
