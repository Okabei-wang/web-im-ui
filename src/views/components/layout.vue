<template>
  <div class="layout-main">
    <div class="left">
      <leftInfo></leftInfo>
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <!-- <div class="right">
      我是右边
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import leftInfo from './leftInfo.vue'
</script>

<style lang="scss" scoped>
@keyframes slideToRight {
  0% {
    opacity: 0;
    width: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    width: 305px;
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.layout-main {
  display: flex;
  margin: 20px;
  height: calc(100vh - 40px);
  width: calc(100vw - 40px);
  .left {
    box-sizing: border-box;
    height: 100%;
    width: 310px;
    background: #191b1d;
    padding: 20px;
    border-radius: 25px;
    margin-right: 10px;
    animation-name: slideToRight;
    animation-duration: 1s;
  }
  .content {
    box-sizing: border-box;
    width: calc(100% - 310px);
    height: 100%;
    padding: 20px;
    border-radius: 25px;
    animation-name: fade;
    animation-duration: 1s;
  }
}
</style>
