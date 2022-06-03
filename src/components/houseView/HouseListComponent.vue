<template>
	<div>
		<div id="area" class="form-group form-inline justify-content-center">
			<label class="mr-2" for="sido">시도 : </label>
			<b-form-select id="gugun" v-model="sidoSelected" :options="sidoOption"></b-form-select>
            <label class="mr-2 ml-3" for="gugun">구군 : </label>
            <b-form-select id="gugun" v-model="gugunSelected" :options="gugunOption"></b-form-select>
            <label class="mr-2 ml-3" for="dong">읍면동 : </label>
            <b-form-select id="dong" v-model="dongSelected" :options="dongOption"></b-form-select>

            <b-button variant="outline-primary" class="ml-3 mt-3" @click="houseSearch">검색</b-button>
		</div>

		<div id="apartment" class="form-group form-inline justify-content-center" style="display: none">
			<div class="form-inline">
				<button id="searchByAptName" class="btn btn-outline-secondary">검색</button>
			</div>
		</div>

        <table class="table mt-2">
            <colgroup>
                <col width="150" />
                <col width="*" />
                <col width="120" />
                <col width="120" />
            </colgroup>
            <thead>
                <tr>
                    <th>아파트이름</th>
                    <th class="text-center">주소</th>
                    <th>건축연도</th>
                    <th>거래 수</th>
                </tr>
            </thead>
            <tbody id="searchResult">
                <tr v-for="(item, index) in houseInfo.slice((currentPage-1)* perPage, currentPage* perPage)" :key="index">
                    <td>{{ item.apartmentName }}</td>
                    <td>{{ item.dong }} {{ item.roadName }} {{ item.roadNameBonbun }}</td>
                    <td>{{ item.buildYear }}</td>
                    <td><a :href="`https://ssafy7.dev/#/house/${item.aptCode}`" target="popup">{{ item.dealCount }}</a></td>
                </tr>
            </tbody>
        </table>

        <b-pagination
                v-model="currentPage"
                :total-rows="houseInfo.length"
                :per-page="perPage"
                align="center"
            ></b-pagination>
	</div>
</template>

<script>
import axios from '@/router/api.js';
import { mapState, mapMutations } from 'vuex';
const gugunInit = [
	{
		value: 0,
		text: '선택'
	}
];
const dongInit = [
	{
		value: 0,
		text: '선택'
	}
];
export default {
	name: 'HappyhouseVueHouseListView',

	data() {
		return {
			sidoSelected: 0,
			gugunSelected: 0,
			dongSelected: 0,

			sidoOption: [
				{
					value: 0,
					text: '선택'
				}
			],
			gugunOption: gugunInit.slice(),
			dongOption: dongInit.slice(),
		};
	},

    computed : {
        ...mapState('houseInfo', ['houseInfo', 'perPage', 'currentPage']),

        currentPage: {
			get() {
				return this.$store.state.houseInfo.currentPage;
			},
			set(newVal) {
                this.SET_CURRENT_PAGE(newVal);
			}
		}
    },

	mounted() {},

	methods: {
        ...mapMutations('houseInfo', ['SET_HOUSEINFO', 'SET_CURRENT_PAGE']),
		getSido() {
			axios
				.get('/address')
				.then((res) => {
					for (const item of res.data) {
						this.sidoOption.push({ value: item.code, text: item.name });
					}
					console.log('sidoList', this.sidoOption);
				})
				.catch((err) => {
					console.error('sidoList', err);
				});
		},

		getGugun(sido) {
			if (sido == 0) return;
			axios
				.get('/address/gugun/' + sido)
				.then((res) => {
					for (const item of res.data) {
						this.gugunOption.push({ value: item.code, text: item.name });
					}
					console.log('guGunList', this.gugunOption);
				})
				.catch((err) => {
					console.error('guGunList', err);
				});
		},

		getDong(gugun) {
			if (gugun == 0) return;
			axios
				.get('/address/dong/' + gugun)
				.then((res) => {
					for (const item of res.data) {
						this.dongOption.push({ value: item.code, text: item.name });
					}
					console.log('dongList', this.dongOption);
				})
				.catch((err) => {
					console.error('dongList', err);
				});
		},

        async houseSearch(){
            let res;
            if(this.sidoSelected == 0){
                res = await axios.get("/house/houseinfo/getAll");
            }else{
                let payload = {}
                payload["sido"] = this.sidoSelected;
                if(this.gugunSelected != 0)
                    payload["gugun"] = this.gugunSelected;
                if(this.dongSelected != 0)
                    payload["dong"] = this.dongSelected;
                res = await axios.post("/house/houseinfo/getAll", payload);
            }

            let result = []
            for (const item of res.data) {
                result.push(item);
            }
            this.SET_HOUSEINFO(result);
            //currentPage는 MapView에서 1로 변경한다.
        }
	},
	created: function () {
		this.getSido();
	},

	watch: {
		sidoSelected: function (selected) {
			// 시도가 변경되면 구군이랑 동은 초기화
			this.gugunSelected = 0;
			this.dongSelected = 0;

			this.gugunOption = gugunInit.slice();
			this.dongOption = dongInit.slice();

			this.getGugun(selected);
		},

        gugunSelected: function(selected) {
            // 구군이 변경되면 동은 초기화
            this.dongSelected = 0;
            this.dongOption = dongInit.slice();
            this.getDong(selected);
        }
	},
};
</script>

<style lang="scss" scoped></style>
