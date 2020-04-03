<template>
    <div>
        <div class="text-center">
            <div class="display-2 font-weight-black">SETTINGS</div>
        </div>

        <div class="mt-8 pl-10 pr-8">
            <div class="d-flex justify-space-between justify-sm-center">
                <span class="headline">
                    <v-icon class="mr-1">fas fa-moon</v-icon> Dark mode
                </span>
                <v-switch
                    class="mt-0 ml-sm-8"
                    v-model="$vuetify.theme.dark"
                    inset
                ></v-switch>
            </div>
        </div>

        <div class="text-center mt-8">
            <a @click="$router.go(-1)">Go back</a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Settings'
}
</script>
