b<template>
	<div>
		<b-container fluid>
			<b-row>
				<b-col sm="1"> </b-col>
        <b-col sm="2">
          <b-form-select v-model="searchType" :options="options">
          </b-form-select>
        </b-col>
				<b-col sm="5">
					<b-form-input
						v-model="keyword"
						placeholder="검색어를 입력해주세요"
						@keydown.enter="search"
					></b-form-input>
				</b-col>
				<b-col sm="2">
					<b-button @click="search">검색</b-button>
				</b-col>
				<b-col sm="2"> </b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
export default {
	name: 'HappyhouseVueArticleSearch',

	data() {
		return {
      searchType : "sub",
			keyword: '',
      options: [
        { value: 'user', text: '작성자' },
        { value: 'sub', text: '제목' },
        { value: 'con', text: '내용'  },
        { value: 'subcon', text: '제목+내용'},
      ]
		};
	},

	mounted() {},

	methods: {
		async search() {
			console.log(this.keyword);
			await this.$store.dispatch('pageNagation/searchQnaList', {
        keyword : this.keyword,
        searchType : this.searchType
      });
		}
	}
};
</script>

<style lang="scss" scoped></style>
