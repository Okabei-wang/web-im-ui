<template>
  <div class="home">
    <layout v-if="isShowContent">
      <router-view></router-view>
    </layout>
  </div>
</template>

<script setup>
import layout from '../components/layout.vue'
import { userInfo, getFriendList } from '../../api/login'
import { ref, onBeforeMount } from 'vue';
import { UserStore } from '../../store/modules/user';
const userStore = UserStore()
const ws = ref(null)
const isShowContent = ref(false)
const io = ref(null)

const initFriendList = async (friendsIdList) => {
  const res = await getFriendList(friendsIdList)
  if(res.code === 0) {
    for(let i in res.data) {
      res.data[i].newMsgCount = 0
    }
    return res.data
  }
}

const initRoomList = async (roomsIdList) => {
  const res = await getRoomList()
}

const getUserInfo = async () => {
  const res = await userInfo()
  if(res.code === 0) {
    const friends = await initFriendList(res.data.friends)
    res.data.friends = friends
    userStore.setInfo(res.data)
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
  // initWs()
})

</script>

<style lang="scss" scoped>
.home {
  height: calc(100vh - 40px);
  width: 100vw;
}
</style>