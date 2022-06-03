import axios from "axios";


let request = axios.create({
    baseURL: "https://ssafy7.dev/api",
});

request.interceptors.request.use(function(config){
    let accessToken = localStorage.getItem("Authorization");
    if(accessToken){
        config.headers.Authorization = accessToken;
    }
    return config;
});

request.interceptors.response.use(function(config){
    if(typeof config.data == "object" && "Authorization" in config.data){
        if(config.data.Authorization){
            localStorage.setItem("Authorization",config.data.Authorization);
        }else{
            localStorage.removeItem("Authorization");
        }
    }
    return config;
});
export default request;