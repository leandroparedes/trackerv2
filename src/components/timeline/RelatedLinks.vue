<template>
    <v-list v-if="links" dense>
        <v-subheader class="text-uppercase">
            RELATED LINKS
        </v-subheader>

        <v-list-item
            v-for="(link, index) in links"
            :key="index"
        >
            <v-list-item-content>
                <a :href="link.link_url" target="_blank">{{ link.link_text }}</a>
            </v-list-item-content>
        </v-list-item>
    </v-list>
    <div v-else class="text-center">
        <div class="subtitle-1 font-weight-light pt-8 pb-5">
            There are not related links.
        </div>
    </div>
</template>

<script>
export default {
    name: 'RelatedLinks',

    props: ['links']
}
</script>
