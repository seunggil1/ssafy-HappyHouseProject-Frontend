<template>
	<div>
		<span v-if="qnaSelect">
			<div align="center">
				<div align="left" style="width: 90%">
					<b-card
						:title="`${qnaSelect.articleno}. ${qnaSelect.subject}`"
						:sub-title="`${qnaSelect.userid}  |  ${qnaSelect.regtime}`"
					>
						<b-card-text class="mt-4">
							<b-container fluid>
								<b-row align-h="between">
									<b-col cols="8">조회수: {{ qnaSelect.hit }} </b-col>
									<b-col cols="4" align="right">
										<b-button variant="success" @click="updateData"> 수정</b-button>
										<b-button variant="danger" style="margin-left: 5px" @click="deleteData">
											삭제</b-button
										>
									</b-col>
								</b-row>
							</b-container>
						</b-card-text>
					</b-card>
				</div>
			</div>

			<b-card>
				<div class="content-detail-content">{{ qnaSelect.content }}</div>

				<div v-for="(comment, idx) in comments" :key="idx">
					<b-container fluid style="width: 90%">
						<b-row style="border: 1px solid black" align-h="between" class="m-2">
							<b-col cols="9">
								<b-container>
									<b-row align-h="start">
										<b-col class="mt-3" cols="3">
											<h4 align="left">{{ comment.userid }}</h4>
										</b-col>
										<b-col sm="auto"></b-col>
									</b-row>
									<b-row align-h="start">
										<b-col
											><p align="left">{{ comment.regtime }}</p></b-col
										>
									</b-row>
									<b-row>
										<b-col class="mb-3">
											<b-form-textarea
												v-model="comment.content"
												placeholder="내용"
												style="height: 100px"
												rows="3"
												:readonly="userID != comment.userid"
											></b-form-textarea>
										</b-col>
									</b-row>
								</b-container>
							</b-col>
							<b-col v-if="userID == comment.userid" cols="3" align-self="end">
								<b-button
									variant="outline-primary"
									style="margin-left: 30px"
									@click="updateComment(comment)"
								>
									수정</b-button
								>
								<b-button
									variant="outline-success"
									style="margin-left: 5px"
									@click="deleteComment(comment.commentno)"
								>
									삭제</b-button
								>
							</b-col>
						</b-row>
					</b-container>
				</div>
			</b-card>
			<div align="center">
				<b-card v-if="userID" style="width: 90%">
					<b-container fluid>
						<b-row align-h="start">
							<b-col align="left"
								><p>{{ userID }}</p></b-col
							>
						</b-row>
						<b-row> </b-row>
					</b-container>
					<div class="content-detail-comment-input">
						<b-form-textarea
							v-model="newComment"
							placeholder="내용"
							style="height: 100px"
							rows="3"
						></b-form-textarea>
					</div>
					<div class="content-detail-comment-button">
						<b-button class="mt-2" variant="primary" @click="insertComment">등록</b-button>
					</div>
				</b-card>
			</div>
		</span>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import axios from '@/router/api.js';
export default {
	name: 'Project1ArticleDetail',

	data() {
		return {
			comments: [],
			newComment: ''
		};
	},

	computed: {
		...mapState('pageNagation', ['qnaSelect']),
		...mapState('memberInfo', ['userID'])
	},
	mounted() {},

	methods: {
		updateData() {
			this.$router.push({ path: '/edit/update' });
		},
		deleteData() {
			console.log(this.qnaSelect);
			this.$store.dispatch('pageNagation/deleteQna', this.qnaSelect.articleno, {
				root: true
			});
		},

		insertComment() {
			let newComments = this.comments.slice(0);

			let requestBody = {
				"articleno": this.qnaSelect.articleno,
				"content": this.newComment,
				"userid": this.userID
			}
			axios.post('/comment', requestBody).then((res) => {
				if(res.data.message == "success"){
					var today = new Date();

					var year = today.getFullYear();
					var month = ('0' + (today.getMonth() + 1)).slice(-2);
					var day = ('0' + today.getDate()).slice(-2);
					var hours = ('0' + today.getHours()).slice(-2); 
					var minutes = ('0' + today.getMinutes()).slice(-2);
					var seconds = ('0' + today.getSeconds()).slice(-2); 

					var dateString = year + '-' + month  + '-' + day;
					var timeString = hours + ':' + minutes  + ':' + seconds;
					requestBody["commentno"] = res.data.commentno;
					requestBody["regtime"] = dateString + ' ' + timeString;

					newComments.push(requestBody);
					this.comments = newComments;
					this.newComment = "";
				}else{
					alert(res.data.message);
				}
			});
		},

		updateComment(comment) {
			axios.put('/comment/' + comment.commentno, comment).then((res) => {
				if(res.data.message == "success"){
					alert("수정되었습니다.");
				}else{
					alert(res.data.message);
				}
			});
			//this.$router.go()
		},

		deleteComment(commentno) {
			axios.delete('/comment/' + commentno).then((res) => {
				if(res.data.message == "success"){
					alert('삭제되었습니다.');
					this.$router.go()
				}else{
					alert(res.data.message);
				}
			});
		}
	},

	async created() {
		const res = await axios.get('/comment/' + this.qnaSelect.articleno);
		this.comments = res.data.message;
	}
};
</script>

<style scoped>
.content-detail-content-info {
	border: 1px solid black;
	display: flex;
	justify-content: space-between;
}

.content-detail-content-info-left {
	width: 720px;
	display: flex;
	flex-direction: row;
	justify-content: left;
	align-items: center;
	padding: 1rem;
}

.content-detail-content-info-left-number {
	margin-left: 1cm;
	margin-right: 1cm;
}

.content-detail-content-info-right {
	width: 300px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 1rem;
}

.content-detail-content {
	border: 1px solid black;
	margin-top: 1rem;
	padding-top: 1rem;
	min-height: 720px;
}
.content-detail-comment {
	border: 1px solid black;
	margin-top: 1rem;
	padding-top: 1rem;
}

.content-detail-button {
	float: right;
	border: 1px solid black;
	margin-top: 1rem;
	padding: 1rem;
}

.content-detail-comment {
	border: 1px solid black;
	margin-top: 1rem;
	padding: 2rem;
}
</style>
