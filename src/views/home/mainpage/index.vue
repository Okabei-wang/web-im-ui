<template>
  <div class="mian-page">
    <div class="title">Hello, {{ userInfo.username }}</div>
    <div class="sub-title">Welcome to here !</div>
    <div class="bg"></div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'

const userInfo = ref(sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {})

onBeforeMount(() => {
})
</script>

<style lang="scss" scoped>
.mian-page {
  // background-image: url('../../../assets/welcome.jpg');
  // background-repeat: no-repeat;
  // background-size: cover;
  // background-position: right bottom;
  // opacity: 0.8;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  // justify-content: center;
  // align-items: center;
  .bg {
    background-image: url('../../../assets/welcome.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: right bottom;
    opacity: 0.8;
    right: 0;
    bottom: 0;
    position: absolute;
    width: 40vw;
    height: 28vw;
    background-color: #000;
    opacity: 0.5;
  }
  .title {
    font-size: 4vw;
  }
  .sub-title {
    color: #424343;
    font-size: 2vw;
  }
}
</style>