<template>
	<div>
		<div id="map"></div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	name: 'HappyhouseVueMapView',

	data() {
		return {
			markerPositions: [],
			markers: [],
			infowindow: null
		};
	},

	mounted() {
		if (window.kakao && window.kakao.maps) {
			this.initMap();
		} else {
			const script = document.createElement('script');
			/* global kakao */
			script.onload = () => kakao.maps.load(this.initMap);
			script.src ='//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=d5ef9b93b01f21b55652f76209901adc&libraries=services,clusterer,drawing';
			document.head.appendChild(script);
		}
	},
	computed:{
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
	watch : {
		houseInfo : function(newVal){
			this.markerPositions = [];
			for(const item of newVal){
				this.markerPositions.push([item.lat, item.lng]);
			}
			this.displayMarker(this.markerPositions);
			
			// currentPage가 바뀌면 displayMarker가 자동으로 실행되지만
			// currentPage가 원래부터 1이면 수동으로 실행시키자.
			if(this.currentPage == 1){
				this.displayMarker(this.markerPositions);
			}else{
				this.currentPage = 1;
			}
		},
		currentPage: function(){
			this.displayMarker(this.markerPositions);
		}
	},
	methods: {
		...mapMutations('houseInfo', ['SET_CURRENT_PAGE']),
		initMap() {
			const container = document.getElementById('map');
			const options = {
				center: new kakao.maps.LatLng(33.450701, 126.570667),
				level: 5
			};

			//지도 객체를 등록합니다.
			//지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
			this.map = new kakao.maps.Map(container, options);
		},
		changeSize(size) {
			const container = document.getElementById('map');
			container.style.width = `${size}px`;
			container.style.height = `${size}px`;
			this.map.relayout();
		},
		displayMarker(markerPositions) {
			if (this.markers.length > 0) {
				this.markers.forEach((marker) => marker.setMap(null));
				this.markers = [];
			}

			const positions = markerPositions.slice((this.currentPage-1)* this.perPage, this.currentPage* this.perPage).map((position) => new kakao.maps.LatLng(...position));

			if (positions.length > 0) {
				this.markers = positions.map(
					(position) => new kakao.maps.Marker({
						map: this.map,
						position
					})
				);

				const bounds = positions.reduce(
					(bounds, latlng) => bounds.extend(latlng),
					new kakao.maps.LatLngBounds()
				);

				this.map.setBounds(bounds);
				
				let clusterer = new kakao.maps.MarkerClusterer({
					map: this.map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
					averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
					minLevel: 1, // 클러스터 할 최소 지도 레벨
					disableClickZoom: false // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정한다
				});
				clusterer.addMarkers(this.markers);
			}

			
		},
		displayInfoWindow() {
			if (this.infowindow && this.infowindow.getMap()) {
				//이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
				this.map.setCenter(this.infowindow.getPosition());
				return;
			}

			var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
				iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
				iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

			this.infowindow = new kakao.maps.InfoWindow({
				map: this.map, // 인포윈도우가 표시될 지도
				position: iwPosition,
				content: iwContent,
				removable: iwRemoveable
			});

			this.map.setCenter(iwPosition);
		}
	}
};
</script>

<style scoped>
#map {
  width: auto;
  height: 600px;
}

.button-group {
  margin: 10px 0px;
}

button {
  margin: 0 3px;
}
</style>
