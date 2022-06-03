<template>
    <div>
        <b-table
			striped
			hover
			:items="boardList"
			:fields="fields"
			@row-clicked="rowClick"
		></b-table>
    </div>
</template>

<script>
import axios from '@/router/api.js';
export default {
    name: 'HappyhouseVuePopularBoardComponent',

    data() {
        return {
            boardList : [],
            fields: [
				{
					key: 'subject',
					label: '제목'
				},
				{
					key: 'userid',
					label: '글쓴이'
				},
				{
					key: 'hit',
					label: '조회수'
				}
			]
        };
    },

    mounted() {
        
    },

    methods: {
        async rowClick(target) {
			console.log(target);
			console.log(target.articleno);
			await this.$store.dispatch('pageNagation/setQnaSelect', target.articleno);
			this.$router.push('/detail');
		},
    },

    created : function(){
        axios.get("/board/board/popular")
        .then(res => {
            this.boardList = [];
            for(const item of res.data){
                this.boardList.push(item);
            }
        })
        .catch(err => {
            console.error(err); 
        })
    }
};
</script>

<style lang="scss" scoped>

</style>