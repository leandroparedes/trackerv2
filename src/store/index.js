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
            yesterdayTotals: {},
            historical: {}
        },
        countries: {
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
        set_global_yesterday_totals (state, yesterdayTotals) {
            state.global.yesterdayTotals = yesterdayTotals;
        },
        set_global_historical (state, historical) {
            state.global.historical = historical;
        },

        set_countries_loaded (state, loaded) {
            state.countries.loaded = loaded;
        },
        set_countries_data (state, data) {
            state.countries.data = data;
        }
    },
    actions: {
        fetch_global_data ({commit}) {
            commit('set_global_loaded', false);

            const totalsUrl = Vue.axios.get('https://corona.lmao.ninja/v2/all');
            const yesterdayTotalsUrl = Vue.axios.get('https://corona.lmao.ninja/v2/all?yesterday=true');
            const historicalUrl = Vue.axios.get('https://corona.lmao.ninja/v2/historical/all');

            Vue.axios.all([totalsUrl, yesterdayTotalsUrl, historicalUrl]).then(Vue.axios.spread((totals, yesterdayTotals, historical) => {
                commit('set_global_totals', totals.data);
                commit('set_global_yesterday_totals', yesterdayTotals.data);
                commit('set_global_historical', historical.data);
            })).finally(() => {
                commit('set_global_loaded', true);
            });
        },

        fetch_countries_data ({commit, state}) {
            commit('set_countries_loaded', false);

            const countriesUrl = 'https://corona.lmao.ninja/v2/countries?sort=cases';

            Vue.axios.get(countriesUrl).then(res => {
                commit('set_countries_data', res.data);
            }).finally(() => {
                commit('set_countries_loaded', true);
            });
        }
    },
    getters: {
        mostAffectedCountries: (state) => {
            if (state.countries.data) {
                return state.countries.data.slice(0, 4);
            }
        }
    }
});
