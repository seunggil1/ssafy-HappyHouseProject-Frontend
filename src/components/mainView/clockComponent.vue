<template>
    <div>
        <b-alert show v-model="time"> {{ time }} </b-alert>
    </div>
</template>

<script>
export default {
    name: 'HappyhouseVueClock',

    data() {
        return {
            time : ""
        };
    },

    mounted() {
        this.getTime()
        setInterval(this.getTime.bind(this) , 1000)
    },

    methods: {
        getTime(){
            let date = new Date();
            let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1): date.getMonth() + 1;
            let day = date.getDate() < 10 ? "0" + date.getDate(): date.getDate();
            let hh = date.getHours() < 10 ? "0" + date.getHours(): date.getHours();
            let mm = date.getMinutes() < 10 ? "0" + date.getMinutes(): date.getMinutes();
            let ss = date.getSeconds() < 10 ? "0" + date.getSeconds(): date.getSeconds();
            this.time = `${month}월 ${day}일 ${hh}:${mm}:${ss}`;
        }
    },
};
</script>

<style lang="scss" scoped>

</style>