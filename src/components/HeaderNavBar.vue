<template>
	<div>
		<b-navbar toggleable="lg" type="dark" variant="info">
			<b-navbar-brand style="cursor: pointer" @click="home">SSAFY HOME</b-navbar-brand>

			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

			<b-collapse id="nav-collapse" is-nav>
				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-nav-item-dropdown right v-if="isLogin">
						<!-- Using 'button-content' slot -->
						<template #button-content> {{ userID }} </template>
						<span>
							<b-dropdown-item @click="move('/profile')">Profile</b-dropdown-item>
							<b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
						</span>
					</b-nav-item-dropdown>

					<b-nav-item-dropdown right v-if="!isLogin">
						<!-- Using 'button-content' slot -->
						<template #button-content> 로그인이 필요합니다. </template>
						<span>
							<b-dropdown-item @click="register">Register</b-dropdown-item>
							<b-dropdown-item @click="show = true">Sign In</b-dropdown-item>
						</span>
					</b-nav-item-dropdown>
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>

		<md-tabs class="md-transparent" md-alignment="right" md-sync-route>
			<md-tab
				v-for="(field, index) in fields"
				:key="index"
				:id="field.label"
				:md-label="field.label"
				:to="field.to"
				:md-disabled="nowPath == field.to"
			></md-tab>

			<!-- <md-tab id="tab-home" md-label="오늘의 소식" md-on-select="move('/main')" :md-disabled="nowPath=='/main'"></md-tab>
			<md-tab id="tab-pages" md-label="게시판" md-on-select="move('/articlelist')" :md-disabled="nowPath=='/articlelist'"></md-tab>
			<md-tab id="tab-posts" md-label="지도" :md-disabled="false"></md-tab> -->
			<md-tab id="tab-favorites" md-label=" " :md-disabled="true"></md-tab>
		</md-tabs>

		<b-modal v-model="show" id="modal-login" title="Login">
			<p class="text-danger">{{ message }}</p>
			<b-container fluid>
				<b-row class="my-1">
					<b-col sm="3">
						<label for="id">ID: </label>
					</b-col>
					<b-col sm="6">
						<b-form-input id="id" type="text" v-model="id"></b-form-input>
					</b-col>
				</b-row>

				<b-row class="my-1">
					<b-col sm="3">
						<label for="pw">PW: </label>
					</b-col>
					<b-col sm="6">
						<b-form-input id="pw" type="password" v-model="pw" @keyup.enter="login"></b-form-input>
					</b-col>
				</b-row>
			</b-container>
			<template #modal-footer>
				<div class="w-100">
					<b-button
						variant="outline-primary"
						size="sm"
						class="float-right m-1"
						@click="show = false"
					>
						Close
					</b-button>
					<b-button variant="primary" size="sm" class="float-right m-1" @click="login">
						Login
					</b-button>
				</div>
			</template>
		</b-modal>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import router from '@/router';
export default {
	name: 'Project1HeaderNavBar',

	data() {
		return {
			show: false,
			id: '',
			pw: '',
			message: ''
		};
	},
	created() {
		this.fields = [
			{
				label: '오늘의 소식',
				to: '/main'
			},
			{
				label: '게시판',
				to: '/articlelist'
			},
			{
				label: '지도',
				to: '/house'
			}
			// {
			//     label : "몰라 쓸지 안쓸지",
			//     to : "/undefined",
			// },
		];
	},

	computed: {
		...mapGetters('memberInfo', ['userID', 'isLogin']),
		nowPath: function () {
			return this.$route.path;
		}
	},
	mounted() {},

	methods: {
		move(link) {
			//console.log(link);
			router.push(link);
		},
		home() {
			router.push('/');
		},

		async login() {
			let res = await this.$store.dispatch('memberInfo/login', { id: this.id, pw: this.pw });

			if (res == 'success') {
				this.message = '';
				this.id = '';
				this.pw = '';
				this.show = false;
				if (this.$route.path == '/main') {
					this.$router.go();
				} else {
					this.$router.push('/');
				}
			} else {
				this.message = 'ID PW를 확인해주세요';
			}
		},

		logout() {
			this.show = false;
			this.$store.dispatch('memberInfo/logout');
		},

		register() {
			this.$router.push('/register');
		}
	}
};
</script>

<style lang="scss" scoped></style>
