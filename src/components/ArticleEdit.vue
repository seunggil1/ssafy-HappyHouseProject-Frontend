<template>
	<div>
		<b-input v-model="qnaSelect.subject" placeholder="제목을 입력해주세요."></b-input>
		<b-form-textarea
			v-model="qnaSelect.content"
			placeholder="내용을 입력해 주세요"
			rows="3"
			max-rows="6"
		></b-form-textarea>
		<br />

		<b-button v-if="updateMode" @click="updateContent">저장</b-button>&nbsp;
		<b-button v-if="!updateMode" @click="uploadContent">등록</b-button>&nbsp;
		<b-button @click="cancel">취소</b-button>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'Project1ArticleEdit',

	data() {
		return {
			updateMode: false
		};
	},

	computed: {
		...mapState('pageNagation', ['qnaSelect']),
		...mapState('memberInfo', ['userID'])
	},
	mounted() {},

	methods: {
		async updateContent() {
			await this.$store.dispatch('pageNagation/updateQna', this.qnaSelect, { root: true });
		},
		async uploadContent() {
			await this.$store.dispatch(
				'pageNagation/addQna',
				{
					content: this.qnaSelect.content,
					subject: this.qnaSelect.subject,
					userid: this.qnaSelect.userid
				},
				{ root: true }
			);
		},
		cancel() {
			this.$router.push('/articlelist');
		}
	},

	created() {
		console.log('query type: ', this.$route.params.type);
		if (this.$route.params.type == 'write') {
			this.updateMode = false;
		} else {
			this.updateMode = true;
		}

		
		if(!this.userID){
			alert("로그인이 필요합니다.");
			this.$router.push("/articlelist");
		}

		if(this.qnaSelect.userid ==''){
			this.qnaSelect.userid = this.userID;
		}
	}
};
</script>

<style lang="scss" scoped></style>
