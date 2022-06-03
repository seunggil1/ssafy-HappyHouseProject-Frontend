import Vue from 'vue';
import VueRouter from 'vue-router';
import MainView from '@/views/MainView.vue';
import HouseView from '@/views/HouseView.vue';
import ArticleList from '@/views/ArticleView.vue';
import ArticleDetail from '@/components/ArticleDetail.vue';
import ArticleEdit from '@/components/ArticleEdit.vue';
import HouseDetailView from "@/views/HouseDetailView.vue";
import HouseMapView from "@/views/HouseMapView.vue";
import MemberRegisterView from "@/views/MemberRegisterView.vue";
import MemberProfileView from "@/views/MemberProfileView.vue";

Vue.use(VueRouter);

// const onlyAuthUser = async (to, from, next) => {
// 	const checkUserInfo = store.getters["memberStore/checkUserInfo"];
// 	const getUserInfo = store._actions["memberStore/getUserInfo"];
// 	let token = sessionStorage.getItem("access-token");
// 	if (checkUserInfo == null && token) {
// 		await getUserInfo(token);
// 	}
// 	if (checkUserInfo === null) {
// 		alert("로그인이 필요한 페이지입니다..");
// 		next({ name: "signIn" });
// 		// router.push({ name: "signIn" });
// 	} else {
// 		// console.log("로그인 했다.");
// 		next();
// 	}
// };

const routes = [
	{
		path: '/',
		redirect: 'main'
	},
	{
		path: '/main',
		name: 'main',
		component: MainView
	},
	{
		path: '/articlelist',
		name: 'articlelist',
		component: ArticleList
	},
	{
		path: '/house',
		component: HouseView,
	},
	{
		path:'/house/:houseid',
		component: HouseDetailView,
	},
	{
		path:'/house/:houseid/map',
		component: HouseMapView,
	},
	{
		path: '/detail',
		name: 'articleDetail',
		component: ArticleDetail
	},
	{
		path: '/edit/:type',
		name: 'articleEdit',
		//beforeEnter: onlyAuthUser,
		component: ArticleEdit
	},
	{
		path : '/register',
		name : 'MemberRegisterView',
		component : MemberRegisterView
	},
	{
		path : '/profile',
		name : 'MemberProfileView',
		component : MemberProfileView
	}
];

const router = new VueRouter({
	routes
});

export default router;
