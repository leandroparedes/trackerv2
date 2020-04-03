import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        global: {
            loaded: false,
            totals: {},
            historical: {}
        },
        countries: {
            loaded: false,
            data: null
        },

        timeline: {
            loaded: false,
            data: null
        }
    },
    mutations: {
        set_global_loaded (state, loaded) {
            state.global.loaded = loaded;
        },
        set_global_totals (state, totals) {
            state.global.totals = totals;
        },
        set_global_historical (state, historical) {
            state.global.historical = historical;
        },

        set_countries_loaded (state, loaded) {
            state.countries.loaded = loaded;
        },
        set_countries_data (state, data) {
            state.countries.data = data;
        },

        set_timeline_loaded (state, loaded) {
            state.timeline.loaded = loaded;
        },
        set_timeline_data (state, data) {
            state.timeline.data = data;
        }
    },
    actions: {
        fetch_global_data ({commit}) {
            commit('set_global_loaded', false);

            const totalsUrl = Vue.axios.get('https://corona.lmao.ninja/all');
            const historicalUrl = Vue.axios.get('https://corona.lmao.ninja/v2/historical/all');

            Vue.axios.all([totalsUrl, historicalUrl]).then(Vue.axios.spread((totals, historical) => {
                commit('set_global_totals', totals.data);
                commit('set_global_historical', historical.data);
            })).finally(() => {
                commit('set_global_loaded', true);
            });
        },

        fetch_countries_data ({commit, state}) {
            commit('set_countries_loaded', false);

            const countriesUrl = 'https://corona.lmao.ninja/countries';

            Vue.axios.get(countriesUrl).then(res => {
                commit('set_countries_data', res.data);
            }).finally(() => {
                commit('set_countries_loaded', true);
            });
        },

        fetch_timeline_data ({commit}) {
            commit('set_timeline_loaded', false);

            const timelineUrl = 'https://covid-situations.herokuapp.com/v1/situations';

            Vue.axios.get(timelineUrl).then(res => {
                commit('set_timeline_data', res.data);
            }).finally(() => {
                commit('set_timeline_loaded', true);
            });
        }
    },
    getters: {
        mostAffectedCountries: (state) => {
            if (state.countries.data) {
                return Object.values(state.countries.data).sort((a, b) => b.cases - a.cases).slice(0, 4);
            }
        }
    }
});
