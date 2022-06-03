<template>
    <div>
        <b-container class="m-3" fluid>
            <b-row>
                <b-col cols="4" scroll>
                    <h3>경로 안내</h3>
                    <div v-if="paths.length > 0">
                        <b-card style="position:relative; height:750px; overflow-y:scroll;">
                            <div v-for="(path, idx) in paths" :key="idx">
                                <b-card :border-variant="(idx == pathSelected) ? 'danger' : 'default'" @click="showPath(path, idx)" class ="mb-1" align="left" :title="`${path.type} | ${path.totalTime}, ${path.payment}`" :sub-title="`${path.totalDistance}`">
                                    <b-card-text>
                                        <div v-for="(subpath, idx2) in path.detail" :key="idx2" align="left">
                                            {{ idx2+1 }}. {{ subpath.description }}
                                        </div>
                                    </b-card-text>
                                </b-card>
                            </div>
                        </b-card>
                    </div>
                    
                </b-col>
                <b-col cols="7" align="center">
                    <div id="map"></div>
                </b-col>
            </b-row>
            <b-row>
                
            </b-row>
        </b-container>
    </div>
</template>

<script>
import axios from '@/router/api.js';

const trainType = ["","KTX", "새마을", "무궁화", "누리호","통근", "ITX", "ITX-청춘", "SRT"];

export default {
    name: 'HappyhouseVueMapView',

    components:{
    },

    data() {
        return {
            markerPositions: [],
			markers: [],
            houseId : "",
            houseInfo: {},
            paths : [],
            polylines : [],
            pathSelected : -1
        };
    },

    async mounted() {
        if (window.kakao && window.kakao.maps) {
			this.initMap();
		} else {
			const script = document.createElement('script');
			/* global kakao */
			script.onload = () => kakao.maps.load(this.initMap);
			script.src ='//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=d5ef9b93b01f21b55652f76209901adc&libraries=services,clusterer,drawing';
			document.head.appendChild(script);
		}

        this.houseId = this.$route.params.houseid;
        this.houseInfo = (await axios.get('/house/houseinfo/' + this.houseId)).data;
        
        console.log(this.houseInfo);
        if (navigator.geolocation) {
            try {
                // GeoLocation을 이용해서 접속 위치를 얻어옵니다
                navigator.geolocation.getCurrentPosition(async (position) => {
                    let startLng = position.coords.longitude; // 경도
                    let startLat = position.coords.latitude; // 위도
                    let endLng = this.houseInfo.lng;
                    let endLat = this.houseInfo.lat;
                    console.log(startLat, startLng);
                    console.log(endLat, endLng);
                    let params = {
                        SX : startLng,
                        SY : startLat,
                        EX : endLng,
                        EY : endLat,
                    }
                    let res = (await axios.post('/address/path', params)).data.result;
                    console.log(res);

                    let paths = [];

                    for(const item of res.path){
                        let path = {
                            type : "",
                            totalTime : "",
                            payment : "",
                            totalDistance : "",
                            detail : []
                        }

                        switch (item.pathType) {
                            case 1:
                                path.type = "지하철";
                                break;
                            case 2:
                                path.type = "버스";
                                break;
                            case 3:
                                path.type = "지하철 + 버스";
                                break;
                            case 11:
                                path.type = "기차";
                                break;
                            case 12:
                                path.type = "고속/시외버스";
                                break;
                            case 13:
                                path.type = "항공";
                                break;
                            case 20:
                                path.type = "시외교통 복합(열차+고속버스 등)";
                                break;
                            default:
                                path.type = "???";
                                break;
                        }
                        path.totalTime = `${item.info.totalTime}분`;
                        
                        if(item.pathType <= 3){
                            path.payment = `${item.info.payment}원`;
                        }else{
                            path.payment = `${item.info.totalPayment}원`;
                        }

                        let km = parseInt(item.info.totalDistance / 1000);
                        let meter = item.info.totalDistance % 1000;

                        if(km == 0){
                            path.totalDistance = `총 거리 : ${meter}m`;
                        }else{
                            path.totalDistance = `총 거리 : ${km}km ${meter}m`;
                        }

                        let pathDetail = [];
                        for(const route of item.subPath){
                            if(route.distance == 0)
                                continue;
                            let distance = route.distance;
                            let sectionTime = route.sectionTime;
                            let description = "";
                            let start = {
                                x : null,
                                y : null
                            };
                            let end = {
                                x : null,
                                y : null
                            };

                            // (지하철,버스) 중간 경유지 역
                            let waypoints = []

                            if(route.passStopList){
                                for(const station of route.passStopList.stations){
                                    waypoints.push({
                                        x : station.x,
                                        y : station.y
                                    });
                                }
                            }
                            let methods = []
                            
                            switch (route.trafficType) {
                                case 1:
                                    for(let method of route.lane){
                                        methods.push(method.name);
                                    }
                                    description = `${methods.join(" 또는 ")} 지하철을 통해 ${route.startName}에서 ${route.endName}까지 ${route.stationCount ?? 0}개 역 이동`;
                                    start.x = route.startX ?? null;
                                    start.y = route.startY ?? null;
                                    end.x = route.endX ?? null;
                                    end.y = route.endY ?? null;
                                    break;
                                case 2:
                                    for(let method of route.lane){
                                        methods.push(method.busNo);
                                    }
                                    description = `${methods.join("번, ")}번 버스를 통해 ${route.startName}에서 ${route.endName}까지 ${route.stationCount ?? 0}개 역 이동`;
                                    start.x = route.startX ?? null;
                                    start.y = route.startY ?? null;
                                    end.x = route.endX ?? null;
                                    end.y = route.endY ?? null;
                                    break;
                                case 3:
                                    description = `걸어서 ${route.distance}m 이동`;
                                    break;
                                case 4:
                                    description = `${trainType[route.trainType]} 기차를 통해 ${route.startName}에서 ${route.endName}까지  ${route.distance}m 이동`;
                                    start.x = route.startX ?? null;
                                    start.y = route.startY ?? null;
                                    end.x = route.endX ?? null;
                                    end.y = route.endY ?? null;
                                    break;
                                case 5:
                                    description = `고속버스를 통해 ${route.startName}에서 ${route.endName}까지  ${route.distance}m 이동`;
                                    start.x = route.startX ?? null;
                                    start.y = route.startY ?? null;
                                    end.x = route.endX ?? null;
                                    end.y = route.endY ?? null;
                                    break;
                                case 6:
                                    description = `시외버스로 ${route.startName}에서 ${route.endName}까지  ${route.distance}m 이동`;
                                    start.x = route.startX ?? null;
                                    start.y = route.startY ?? null;
                                    end.x = route.endX ?? null;
                                    end.y = route.endY ?? null;
                                    break;
                                case 7:
                                    description = `비행기로 ${route.startName}에서 ${route.endName}까지  ${route.distance}m 이동`;
                                    start.x = route.startX ?? null;
                                    start.y = route.startY ?? null;
                                    end.x = route.endX ?? null;
                                    end.y = route.endY ?? null;
                                    break;

                                default:
                                    description = "?????";
                                    break;
                                
                            }

                            let p = {
                                start,
                                end,
                                distance,
                                sectionTime,
                                description,
                                waypoints
                            }
                            pathDetail.push(p);
                        }
                        path.detail = pathDetail;
                        paths.push(path);
                    }

                    for(const path of paths){
                        const startElement = path.detail[0];
                        if(startElement.start.x == null || startElement.start.y == null){
                            startElement.start.x = startLng;
                            startElement.start.y = startLat;
                        }

                        for (let index = 1; index < path.detail.length; index++) {
                            const preElement = path.detail[index-1];
                            const element = path.detail[index];
                            
                            if(preElement.end.x == null || preElement.end.y == null){
                                preElement.end.x = element.start.x;
                                preElement.end.y = element.start.y;
                            }else if(element.start.x == null || element.start.y == null){
                                element.start.x = preElement.end.x;
                                element.start.y = preElement.end.y;
                            }

                        }

                        const endElement = path.detail[path.detail.length-1];
                        if(endElement.end.x == null || endElement.end.y == null){
                            endElement.end.x = endLng;
                            endElement.end.y = endLat;
                        }
                    }
                    
                    this.paths = paths;
                    console.log(this.paths);
                    let positions = [];
                    positions.push([params.SY, params.SX], [params.EY, params.EX]);
                    this.displayMarker(positions);
                });
            } catch (error) {
                console.log("err");
            }
            
        }else{
            console.log("err");
        }

        
    },

    methods: {
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

        showPath(path, idx){
            this.pathSelected = idx;
            const colors = ["#FF3DE5", "#00008b", "#00FFFF", "#6b8e23"];
            
            for(const polyline of this.polylines){
                polyline.setMap(null);
            }
            this.polylines = [];
            
            let color = 0;
            for(let subpath of path.detail){
                let latlngs = [];
                
                if(subpath.waypoints.length >= 2){
                    for(const pos of subpath.waypoints){
                        latlngs.push(new kakao.maps.LatLng(pos.y, pos.x));
                    }
                }else{
                    latlngs = [
                        new kakao.maps.LatLng(subpath.start.y, subpath.start.x),
                        new kakao.maps.LatLng(subpath.end.y, subpath.end.x)
                    ];
                }
                let polyline = new kakao.maps.Polyline({
                    path: latlngs, // 선을 구성하는 좌표배열 입니다
                    strokeWeight: 5, // 선의 두께 입니다
                    strokeColor: colors[color % colors.length], // 선의 색깔입니다
                    strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle: 'solid' // 선의 스타일입니다
                });

                polyline.setMap(this.map);
                this.polylines.push(polyline);

                color++;
            }
        },

		displayMarker(markerPositions) {
			if (this.markers.length > 0) {
				this.markers.forEach((marker) => marker.setMap(null));
			}

			const positions = markerPositions.map((position) => new kakao.maps.LatLng(...position));

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
					minLevel: 2, // 클러스터 할 최소 지도 레벨
					disableClickZoom: false // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정한다
				});
				clusterer.addMarkers(this.markers);
			}

			
		},
    },

    created (){
        this.$store.dispatch("memberInfo/CSRF");
    }
};
</script>

<style scoped>
#map {
  width: auto;
  height: 800px;
}

.button-group {
  margin: 10px 0px;
}

button {
  margin: 0 3px;
}
</style>