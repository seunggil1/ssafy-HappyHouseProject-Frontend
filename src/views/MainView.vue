<template>
	<div>
		<b-container fluid class="mainview" v-model="news">
			<b-row>
				<b-col cols="8">
					<b-row align="center">
						<b-col><clock-component></clock-component></b-col>
					</b-row>
					<b-row v-for="(ne, index) in news.slice((currentPage-1)* perPage, currentPage* perPage)" :key="index">
						<news-component :link="ne.link" :description="ne.description" :title="ne.title"></news-component>
						<!-- <b-col>{{ne.link}}</b-col>
						<b-col>{{ne.title}}</b-col>
						<b-col>{{ne.description}}</b-col> -->
					</b-row>
					<b-row>
						<b-col>
							<b-pagination
								v-model="currentPage"
								:total-rows="newsLength"
								:per-page="perPage"
								class="mt-2"
								align="center"
							></b-pagination>
						</b-col>
					</b-row>
				</b-col>
				<b-col cols="4">
					<b-row>
						<b-col>
							<b-card>
								<calendar-component></calendar-component>
							</b-card>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
		</b-container>		
	</div>
</template>

<script>
import axios from '@/router/api.js';
import clockComponent from "@/components/mainView/clockComponent.vue"
import calendarComponent from "@/components/mainView/calendarComponent.vue";
import NewsComponent from '@/components/mainView/newsComponent.vue';

export default {
  components: { clockComponent, calendarComponent, NewsComponent},
	name: 'HappyhouseVueMainView',

	data() {
		return {
			perPage : 5,
			currentPage : 1,
			news : []
		};
	},

	mounted() {},

	async created() {
		axios.get("/utility/news").then(res=>{
			this.news = res.data;
		});

		this.$store.dispatch("memberInfo/CSRF");
	},

	methods: {},

	computed : {
		newsLength : function(){
			return this.news.length;
		}
	}
};
</script>

<style scoped>
.mainview{
	margin: 10px;
}

</style>
