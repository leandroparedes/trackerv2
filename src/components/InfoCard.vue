<template>
    <v-card :style="{'border-top': `4px solid ${this.color}`}">
        <v-card-title class="d-flex justify-space-between">
            <slot name="title">Information</slot>
            <v-icon :color="color">
                <slot name="icon"></slot>
            </v-icon>
        </v-card-title>
        <v-card-subtitle class="pb-2">
            <slot name="subtitle"></slot>
        </v-card-subtitle>
        <v-card-text class="headline pb-1">
            <slot name="count-total">0</slot>
            <span class="body-1 font-weight-bold success--text ml-1">
                <slot name="count-today"></slot>
            </span>
        </v-card-text>
        <v-card-subtitle class="pt-0">
            <slot name="additional-info"></slot>
        </v-card-subtitle>
    </v-card>
</template>

<script>
export default {
    name: 'InfoCard',

    props: {
        color: {
            type: String
        }
    }
}
</script>