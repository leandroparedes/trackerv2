<template>
    <v-app>
        <v-app-bar app>
            <v-btn icon large to="/global">
                <v-icon>fas fa-globe-americas</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon large to="/search">
                <v-icon>fas fa-search</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon large to="/compare">
                <v-icon>fas fa-chart-bar</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon large to="/settings">
                <v-icon>fas fa-cog</v-icon>
            </v-btn>
        </v-app-bar>
        <v-content>
            <v-container class="mt-4">
                <router-view :key="$route.fullPath"></router-view>
            </v-container>
        </v-content>

        <v-footer padless class="font-weight-medium">
            <v-col class="text-center" cols="12">
                {{ new Date().getFullYear() }} —
                <strong>Developed by
                    <a href="https://github.com/leandroparedes" target="_blank">Leandro Paredes</a>
                </strong>
            </v-col>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    name: 'App'
}
</script>
