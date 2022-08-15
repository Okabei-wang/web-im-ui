<template>
  <div class="mian-page">
    <div class="title">Hello, {{ userInfo.username }}</div>
    <div class="sub-title">Welcome to here !</div>
    <div class="bg"></div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import socketio from 'socket.io-client'

const userInfo = ref(sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {})

const initSocket = () => {
  let io = socketio('http://localhost:3000', {
    //transports和服务端统一，否则会跨域
      transports: ['websocket']
  })
  //向服务端发送消息
  const info = JSON.parse(sessionStorage.getItem('userInfo'))
  io.emit('login', { userId: info._id, username: info.username })
  io.on('message', (data) => {
    console.log('message: ', data)
  })

  // setInterval(() => {
  //   // 每15s心跳一次
  //   io.emit('heartbeat', { userId: info._id, username: info.username})
  // }, 15000)
}

onBeforeMount(() => {
  initSocket()
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