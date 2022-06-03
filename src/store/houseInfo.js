import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
	namespaced: true,
	state: {
		houseInfo : [],

        // pagination
        perPage : 10,
        currentPage : 1,
	},
	mutations: {
        CLEAR_HOUSEINFO : (state) =>{
            state.houseInfo = [];
        },
		SET_HOUSEINFO: (state, newVal) => {
            state.houseInfo = [];
			state.houseInfo = newVal;
		},

        SET_CURRENT_PAGE: function (state, newVal) {
            state.currentPage = newVal;
        }
	},
	actions: {
	},
	getters: {

	}
};
