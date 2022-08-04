<template>
  <div class="mian-page">
    <div class="title">Hello, {{ userInfo.username }}</div>
    <div class="sub-title">Welcome to here !</div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'

const userInfo = ref(sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {})
</script>

<style lang="scss" scoped>
.mian-page {
  background-image: url('../../../assets/welcome.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  height: 100%;
  // justify-content: center;
  // align-items: center;
  .title {
    font-size: 4vw;
  }
  .sub-title {
    color: #424343;
    font-size: 2vw;
  }
}
</style>