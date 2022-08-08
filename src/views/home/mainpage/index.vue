<template>
  <div class="mian-page">
    <div class="title">Hello, {{ userInfo.username }}</div>
    <div class="sub-title">Welcome to here !</div>
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
  io.emit('sendMsg', { type: 0, time: new Date(), message: `${info.username} 链接 websocket`, userId: info._id })

  //接收服务端相对应的setId数据
  io.on('setId', data => {
    console.log(data)
  })
}

onBeforeMount(() => {
  initSocket()
})
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