import Vue from 'vue';
import Vuex from 'vuex';
import axios from '@/router/api.js';
import router from '@/router';

Vue.use(Vuex);

export default {
	namespaced: true,
	state: {
		qnaList: [''],
		qnaSelect: null,
		currentPage: 1
	},
	mutations: {
		SET_CURRENT_PAGE: (state, newVal) => {
			return (state.currentPage = newVal);
		},
		SET_QNA_LIST: function (state, qnaList) {
			state.qnaList = qnaList;
		},
		SET_QNA_SELECT: function (state, qnaSelect) {
			state.qnaSelect = qnaSelect;
		},
		CLEAR_QNA_SELECT: function (state) {
			state.qnaSelect = {
				content: '',
				subject: '',
				userid: ''
			};
		}
	},
	actions: {
		setQnaList: async function ({ commit }) {
			let res = await axios({
				url: '/board',
				method: 'GET'
			});
			console.log('SET_QNA_LIST', res.data);
			commit('SET_QNA_LIST', res.data);
		},
		setQnaSelect: async function ({ commit }, id) {
			const res = await axios({
				url: '/board/' + id,
				method: 'GET'
			});
			commit('SET_QNA_SELECT', res.data);
			// return axios({
			// 	url: 'http://localhost:9999/vue/board/' + id,
			// 	method: 'GET'
			// }).then(res=>{
			//     console.log('SET_QNA_SELECT', res.data);
			//     commit('SET_QNA_SELECT', res.data);
			// }).catch(err =>{
			//     console.log("Internal Error: " , err);
			// });
		},
		addQna: async function (state, qna) {
			try {
				const res = await axios.post('/board', qna);
				console.log(res.data);
				if (res.data.message == 'success') {
					alert('등록 성공!');
					router.push('/articlelist');
				} else {
					throw 'Server Internal Error';
				}
			} catch (error) {
				alert(error);
			}
		},

		updateQna: async function (state, qna) {
			try {
				const res = await axios.put('/board/' + qna.articleno, qna);
				console.log(res.data);
				if (res.data.message == 'success') {
					alert('수정 완료!');
					router.push('/articlelist');
				} else {
					throw 'Server Internal Error';
				}
			} catch (error) {
				alert(error);
			}
		},
		deleteQna: async function (state, id) {
			try {
				const res = await axios.delete('/board/' + id);
				console.log(res.data.message);
				if (res.data.message == 'success') {
					alert('삭제 완료!');
					router.push('/articlelist');
				} else {
					throw 'Server Internal Error';
				}
			} catch (error) {
				alert(error);
			}
		},

		searchQnaList: async function (state, payload) {
			try {
				if(payload.keyword == ""){
					await state.dispatch('setQnaList');
					return
				}else{
					let res = await axios.get(`/board/search/${payload.searchType}/${payload.keyword}`);
					if (res.data) {
						state.commit('SET_QNA_LIST', res.data);
					} else {
						throw 'Server Internal Error';
					}
				}
					
			} catch (error) {
				alert(error);
			}
		}
	},
	getters: {
		qnaListLength: function (state) {
			return state.qnaList.length;
		}
	}
};
