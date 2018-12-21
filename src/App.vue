<template>
  <div id="app">
    <head-tem></head-tem>
    <router-view/>
  </div>
</template>
<script>
  import headTem from './components/header'
  export  default {
    components: { headTem }
  }

</script>
<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
