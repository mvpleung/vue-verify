<template>
  <div id="app">
    <verify/>
  </div>
</template>

<script>
import Verify from './Verify';

export default {
  name: 'app',
  components: {
    Verify
  }
};
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
