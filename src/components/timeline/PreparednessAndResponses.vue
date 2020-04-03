<template>
    <v-list v-if="actions" dense>
        <v-subheader class="text-uppercase">
            PREPAREDNESS AND RESPONSES
        </v-subheader>

        <v-list-group
            v-for="(action, index) in actions"
            :key="index"
        >
            <template v-slot:activator>
                <v-list-item-title>{{ action.authority }}</v-list-item-title>
            </template>

            <v-list-item
                v-for="(action, index) in action.actions"
                :key="index"
                link
            >
                <v-list-item-content>{{ action }}</v-list-item-content>
            </v-list-item>
        </v-list-group>
    </v-list>
    <div v-else class="text-center">
        <div class="subtitle-1 font-weight-light pt-8 pb-5">
            There are not preparedness or responses actions.
        </div>
    </div>
</template>

<script>
export default {
    name: 'PreparednessAndResponses',

    props: ['actions']
}
</script>