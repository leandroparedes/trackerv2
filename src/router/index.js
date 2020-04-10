import Vue from 'vue';
import VueRouter from 'vue-router';
import Global from '@/views/Global.vue';
import Search from '@/views/Search.vue';
import ViewCountry from '@/views/ViewCountry.vue';
import Compare from '@/views/Compare.vue';
import Settings from '@/views/Settings.vue';
import Timeline from '@/views/Timeline.vue';
import ViewRegion from '@/views/ViewRegion.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/global'
    },
    {
        path: '/global',
        name: 'Global',
        component: Global,
        meta: { title: 'Global Status' }
    },
    {
        path: '/country/:countryCode',
        name: 'ViewCountry',
        component: ViewCountry,
        meta: { title: 'Country Status' }
    },
    {
        path: '/search',
        name: 'Search',
        component: Search,
        meta: { title: 'Search Country' }
    },
    {
        path: '/compare',
        name: 'Compare',
        component: Compare,
        meta: { title: 'Compare Countries' }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings,
        meta: { title: 'Settings' }
    },
    {
        path: '/timeline',
        name: 'Timeline',
        component: Timeline,
        meta: { title: 'Timeline' }
    },
    {
        path: '/region/:region',
        name: 'ViewRegion',
        component: ViewRegion,
        meta: { title: 'Region Status' }
    }
];

const qs = require('qs');

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    parseQuery(query) {
        return qs.parse(query);
    },
    stringifyQuery(query) {
        // in compare the countries needs to be
        // a string separated by ;
        // this return the string without encoding
        if (query.c) {
            return '?c=' + query.c;
        }

        var result = qs.stringify(query);
        return result ? ('?' + result) : '';
    }
});

const DEFAULT_TITLE = 'Covid-T';

router.afterEach((to, from ) => {
    Vue.nextTick(() => {
        document.title = `${to.meta.title} | Covid-19 Tracker` || DEFAULT_TITLE;
    });
});

export default router;
