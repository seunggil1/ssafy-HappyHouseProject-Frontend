<template>
	<div>
        <b-container class="pr-auto">
            <b-row>
                <b-col>
                    <div class="row">
                        <div class="col mb-lg-0 mb-4 ms-auto">
                            <div class="card">
                                <div class="card-body p-3">
                                    <div class="row">
                                        <div class="col" align="left">
                                            <h5>
                                              {{ houseInfo.apartmentName }}
                                            </h5>
                                            <p class="mt-3 me-auto">
                                                {{ houseInfo.dong }} {{ houseInfo.roadName }} {{ houseInfo.roadNameBonbun }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <h6> 거래 건수 : {{ houseInfo.dealCount }} </h6>
                                        </div>
                                        <div>
                                            <b-link :to="`./${houseInfo.aptCode}/map`">
                                                <b-button variant="outline-primary me-2" >길 찾기</b-button>
                                            </b-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </b-container>
        <hr>
		<b-table
			bordered
			fixed
			no-border-collapse
			hover
            head-variant="light"
			:items="houseDealList"
			:per-page="perPage"
			:current-page="currentPage"
			:fields="fields"
		></b-table>
		<b-pagination
			v-model="currentPage"
			:total-rows="totalLength"
			:per-page="perPage"
			align="center"
		></b-pagination>
	</div>
</template>

<script>
import axios from '@/router/api.js';
export default {
	name: 'HappyhouseVueHouseDetailView',

	data() {
		return {
            currentPage : 1,
			houseDealList: [],
			houseInfo: {},

			perPage: 6,
			fields: [
				{
					key: 'time',
					label: '날짜',
                    sortable: true
				},
				{
					key: 'floor',
					label: '층',
                    sortable: true
				},
				{
					key: 'area',
					label: '평',
                    sortable: true
				},
				{
					key: 'dealAmount',
					label: '거래 금액',
                    sortable: true
				}
			]
		};
	},
	computed: {
		totalLength() {
			return this.houseDealList.length;
		}
	},

	mounted() {},

	methods: {
        goMapView(){

        }
    },
	async created() {
		const houseId = this.$route.params.houseid;
		let houseDeals = await axios.get('/house/housedeal/' + houseId);
		this.houseInfo = (await axios.get('/house/houseinfo/' + houseId)).data;

		houseDeals = houseDeals.data;

		for (const item of houseDeals) {
			this.houseDealList.push({
				time: `${item.dealYear}년 ${item.dealMonth}월 ${item.dealDay}일`,
				area: item.area,
				floor: item.floor,
				dealAmount: item.dealAmount
			});
		}

		this.$store.dispatch("memberInfo/CSRF");
	},

};
</script>

<style lang="scss" scoped></style>
