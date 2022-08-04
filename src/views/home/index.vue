<template>
  <div class="home">
    <layout v-if="isShowContent">
      <router-view></router-view>
    </layout>
  </div>
</template>

<script setup>
import layout from '../components/layout.vue'
import { userInfo } from '../../api/login'
import { ref, onBeforeMount } from 'vue';

const ws = ref(null)
const isShowContent = ref(false)

const getUserInfo = async () => {
  const res = await userInfo()
  if(res.code === 0) {
    sessionStorage.setItem('userInfo', JSON.stringify(res.data))
    isShowContent.value = true
  }
}

const initWs = () => {
  ws.value = new WebSocket('ws:127.0.0.1:8002');
  ws.onmessage = (msg) => {
    console.log(JSON.parse(msg.data))
  }

  ws.onopen = () => {
    console.log('socket is opened')
  }
}

onBeforeMount(async () => {
  await getUserInfo()
  initWs()
})

</script>

<style lang="scss" scoped>
.home {
  height: calc(100vh - 40px);
  width: 100vw;
}
</style>