import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import pageNagation from './pageNagation.js';
import houseInfo from './houseInfo.js';
import memberInfo from './memberInfo.js';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null
	},
	modules: {
		pageNagation: pageNagation,
		houseInfo : houseInfo,
		memberInfo : memberInfo
	},

	plugins: [
		createPersistedState({
			//주목! : 여기에 쓴 모듈만 저장됩니다.
			paths: ['pageNagation', 'memberInfo']
		})
	]
});
