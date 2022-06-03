<template>
    <div>
        <b-container class="mt-1 mb-1">
            <b-row>
                <b-col cols="7">
                    <house-list-component></house-list-component>
                </b-col>
                <b-col cols="5" align="center">
                    <map-component></map-component>
                </b-col>
            </b-row>
            <b-row>
                
            </b-row>
        </b-container>
        
        
    </div>
</template>

<script>
import MapComponent from "@/components/houseView/MapComponent.vue";
import HouseListComponent from"@/components/houseView/HouseListComponent.vue";

export default {
    name: 'HappyhouseVueHouseView',

    components : {
        MapComponent,
        HouseListComponent,
    },

    data() {
        return {};
    },

    mounted() {
        
    },

    methods: {

    },
    created() {
        this.$store.dispatch("memberInfo/CSRF");
    },
};
</script>

<style scoped>

</style>