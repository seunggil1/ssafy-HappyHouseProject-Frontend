<template>
	<div>
		<b-container>
			<b-row>
				<b-col cols="3"></b-col>
				<b-col cols="6">
					<b-form @submit="onSubmit" @reset="withdrawal" v-if="userInfo">
						<b-form-group id="input-group-1" label="Email address" label-for="input-1">
							<b-form-input
								id="input-1"
								v-model="userInfo.email"
								type="email"
								placeholder="Enter email"
								@blur.native="checkEmailValid"
								required
								readonly
							></b-form-input>
						</b-form-group>

						<b-form-group id="input-group-2" label="Your ID" label-for="input-2">
							<b-form-input
								id="input-ID"
								v-model="userInfo.userid"
								placeholder="Enter ID"
								required
								readonly
							></b-form-input>
						</b-form-group>

						<b-form-group id="input-group-3" label="Your Password" label-for="input-2">
							<b-form-input
								id="input-3"
								v-model="userInfo.userpwd"
								placeholder="Enter Password"
								type="password"
								@blur.native="userPwdCheck = ''"
								required
							></b-form-input>
						</b-form-group>

						<b-form-group
							id="input-group-4"
							:label="`Password Check: ${passwordMessage}`"
							label-for="input-2"
						>
							<b-form-input
								id="input-4"
								v-model.lazy="userPwdCheck"
								placeholder="Enter Password"
								type="password"
								@blur.native="checkPasswordValid"
								required
							></b-form-input>
						</b-form-group>

						<b-form-group id="input-group-4" label="Your Name" label-for="input-2">
							<b-form-input
								id="input-2"
								v-model="userInfo.username"
								placeholder="Enter name"
								required
							></b-form-input>
						</b-form-group>

						<b-button type="submit" variant="primary" class="m-1">수정</b-button>
						<b-button type="reset" variant="danger" class="m-1">회원 탈퇴</b-button>
					</b-form>
					<div v-else>
						<h2>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</h2>
					</div>
				</b-col>
				<b-col cols="3"></b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
/* eslint-disable-next-line */
const emailRegex = /.+\@.+\..+/;
import axios from '@/router/api.js';
import { mapState } from 'vuex';
export default {
	name: 'HappyhouseVueMemberProfile',

	data() {
		return {
			userInfo: null,
			userPwdCheck: '',
			passwordMessage: ''
		};
	},

	computed: {
		...mapState('memberInfo', ['userID'])
	},

	mounted() {},

	methods: {
		onSubmit(event) {
			event.preventDefault();
			if (this.passwordMessage != 'valid') {
				alert('형식이 잘못되었습니다.');
				return;
			}

			axios
				.put('/user/info/' + this.userInfo.userid, this.userInfo)
				.then((res) => {
					let data = res.data;
					if (data.message == 'success') {
						alert(data.message);
						this.$router.push('/');
					}else{
                        alert(data.message);
                    }
				})
				.catch((err) => {
					alert(err);
					console.error(err);
				});
		},
		withdrawal(event) {
			event.preventDefault();
			if (confirm('회원 탈퇴 이후에는 복구할 수 없습니다. 진행하겠습니까?')) {
				axios
					.delete('/user/info/' + this.userInfo.userid)
					.then((res) => {
						let data = res.data;
						if (data.message == 'success') {
							alert(data.message);
							this.$router.push('/');
						}
					})
					.catch((err) => {
						alert(err);
						console.error(err);
					});
			}
		},

		checkPasswordValid() {
			if (this.userInfo.userpwd != this.userPwdCheck) {
				this.passwordMessage = 'Password is not match.';
			} else if (this.userPwdCheck.length <= 5) {
				this.passwordMessage = 'Password is too short.';
			} else {
				this.passwordMessage = 'valid';
			}
		}
	},

	created() {
		console.log(this.userID);
		axios.get('/user/info/' + this.userID).then((res) => {
			console.log('userInfo', res.data);
			if (res.data.message == 'success') {
				this.userInfo = res.data.userInfo;
			}
		});
	}
};
</script>

<style lang="scss" scoped></style>
