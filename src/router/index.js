import Vue from 'vue';
import VueRouter from 'vue-router';
import Global from '@/views/Global.vue';
import Search from '@/views/Search.vue';
import ViewCountry from '@/views/ViewCountry.vue';
import Compare from '@/views/Compare.vue';
import Settings from '@/views/Settings.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/global'
    },
    {
        path: '/global',
        name: 'Global',
        component: Global
    },
    {
        path: '/country/:countryCode',
        name: 'ViewCountry',
        component: ViewCountry
    },
    {
        path: '/search',
        name: 'Search',
        component: Search
    },
    {
        path: '/compare',
        name: 'Compare',
        component: Compare
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
