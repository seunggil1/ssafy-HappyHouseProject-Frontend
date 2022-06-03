import jwt_decode from 'jwt-decode';
import axios from '@/router/api.js';
const memberStore = {
	namespaced: true,
	state: {
		isLogin: false,
		userID: null
	},
	getters: {
		userID: function (state) {
			return state.userID;
		},
		isLogin: function (state) {
			return state.isLogin;
		}
	},
	mutations: {
		SET_IS_LOGIN: (state, isLogin) => {
			state.isLogin = isLogin;
		},

		SET_USER_ID: (state, userID) => {
			state.userID = userID;
		}
	},
	actions: {
		async CSRF({ commit }) {
			let res = await axios.get('/user/valid');
			console.log(res.data);
			if (res.data.message == 'success') {
				let decode_token = jwt_decode(localStorage.getItem('Authorization'));
				commit('SET_IS_LOGIN', true);
				commit('SET_USER_ID', decode_token.userid);
			} else {
				commit('SET_IS_LOGIN', false);
				commit('SET_USER_ID', null);
			}
		},

		async login(state, payload) {
			let id = payload.id.trim();
			let pw = payload.pw.trim();
			if (id == '' || pw == '') return 'ID, PW를 확인해주세요.';

			let res = await axios.post('/user/login', {
				userid: id,
				userpwd: pw
			});
			return res.data.message;
		},

		async logout({ commit }) {
			let res = await axios.get('/user/logout');
			console.log(res.data);
			if (res.data.message == 'success') {
				commit('SET_IS_LOGIN', false);
				commit('SET_USER_ID', null);
				alert('로그아웃 되었습니다.');
			} else {
				alert('Logout Error');
			}
		},

		 
	}
};

export default memberStore;
