<template>
	<div id="app">
		<header-nav-bar></header-nav-bar>
		<router-view></router-view>
	</div>
</template>

<script>
import HeaderNavBar from '@/components/HeaderNavBar.vue';
export default {
	name: 'HappyhouseVueApp',

	components: {
		HeaderNavBar 
	},
	data() {
		return {};
	},

	mounted() {},

	methods: {
	}
};
</script>

<style>

@font-face {
  font-family: "Happiness-Sans-Title";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2205@1.0/Happiness-Sans-Title.woff2")
    format("woff2");
  font-weight: normal;
  font-style: normal;
}

* {
  font-size: 0.981em;
  font-family: "Happiness-Sans-Title";
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

nav {
	padding: 30px;
}

nav a {
	font-weight: bold;
	color: #2c3e50;
}

nav a.router-link-exact-active {
	color: #42b983;
}
</style>
