<template>
    <div v-if="highlights && highlights.length">
        <div class="overline">Highlights</div>
        <div
            v-for="(highlight, index) in highlights"
            :key="index"
        >
            <div
                class="primary--text font-weight-light mb-2"
                :class="displaySize(highlights.length)"
            >
                {{ highlight }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Highlights',

    props: ['highlights'],
    
    methods: {
        displaySize: function (highlightsCount) {
            if (highlightsCount > 4) {
                return 'headline';
            }
            return 'display-1'
        }
    }
}
</script>