<template>
	<div>
		<b-container fluid>
			<b-row align-h="around">
				<b-col sm="4">
					<b-card title="인기글">
						<popular-board-component></popular-board-component>
					</b-card>
				</b-col>
				<b-col sm="8">
					<b-card>
						<b-table
							striped
							hover
							:items="qnaList"
							:per-page="perPage"
							:current-page="currentPage"
							:fields="fields"
							@row-clicked="rowClick"
						></b-table>
						<b-pagination
							v-model="currentPage"
							:total-rows="qnaListLength"
							:per-page="perPage"
							align="center"
						></b-pagination>
						<b-button @click="writeContent">글쓰기</b-button>
						<div><br /></div>
						<article-search></article-search>
					</b-card>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
const pageNagation = 'pageNagation';
import { mapState, mapGetters } from 'vuex';
import ArticleSearch from '@/components/ArticleSearch.vue';
import PopularBoardComponent from "@/components/mainView/popularBoardComponent.vue";
export default {
	name: 'Project1ArticleList',
	components: {
		ArticleSearch, PopularBoardComponent
	},
	data() {
		return {
			perPage: 6,
			fields: [
				{
					key: 'articleno',
					label: '번호'
				},
				{
					key: 'subject',
					label: '제목'
				},
				{
					key: 'userid',
					label: '글쓴이'
				},
				{
					key: 'regtime',
					label: '작성일'
				},
				{
					key: 'hit',
					label: '조회수'
				}
			]
		};
	},

	mounted() {},

	methods: {
		async rowClick(target) {
			console.log(target);
			console.log(target.articleno);
			await this.$store.dispatch('pageNagation/setQnaSelect', target.articleno);
			this.$router.push('/detail');
		},
		writeContent() {
			this.$store.commit('pageNagation/CLEAR_QNA_SELECT');
			this.$router.push({ path: '/edit/write' });
		}
	},

	computed: {
		...mapState(pageNagation, ['qnaList']),
		...mapGetters(pageNagation, ['qnaListLength']),

		currentPage: {
			get() {
				return this.$store.state.pageNagation.currentPage;
			},
			set(newVal) {
				return this.$store.commit('pageNagation/SET_CURRENT_PAGE', newVal);
			}
		}
	},

	async created() {
		this.$store.dispatch('pageNagation/setQnaList', { root: true });
		this.$store.dispatch("memberInfo/CSRF");
	}
};
</script>

<style lang="scss" scoped></style>
