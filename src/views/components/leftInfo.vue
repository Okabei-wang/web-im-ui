<template>
  <div class="search">
    <n-input v-model:value="room" round placeholder="Search into a room">
      <template #suffix>
        <n-icon :component="EnterOutline" class="enter-icon" @click="handleSearch"/>
      </template>
    </n-input>
  </div>
  <div class="avatar">
    <n-avatar
      size="medium"
      :src="userInfo.avatar"
    />
    <div class="avatar-center">
      <div class="name">{{ userInfo.username }}</div>
      <div class="status">
        <span class="status-icon">
          <n-icon size="10" :component="EllipsisHorizontal" @click="handleMore"/>
        </span>
        Achive for chat
      </div>
    </div>
    <n-icon :component="EllipsisHorizontal" class="avatar-more" @click="handleMore"/>
  </div>
  <div class="room">
    <n-collapse>
      <n-collapse-item title="Room List">
        <div v-if="userInfo.roomlist && userInfo.roomlist.length">
          <div v-for="item in userInfo.roomlist" :key="item.roomId" @click="handleSelectRoom(item._id)" :class="[ roomSelected === item._id ? 'room-item-active room-item' : 'room-item']">
            <n-icon class="left-icon" :component="Home"/>
            {{ item.roomname }}
            <span class="message-tip" v-if="item.newMsgCount">
              {{ item.newMsgCount }}
            </span>
          </div>
        </div>
        <div class="empty" v-else>
          absolutely empty
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
  <div class="friends">
    <n-collapse>
      <n-collapse-item title="Friends List">
        <div v-if="userInfo.friends && userInfo.friends.length">
          <div v-for="item in userInfo.friends" :key="item.id" @click="handleSelectPersion(item.id)" :class="[ friendSelected === item.id ? 'friend-item-active friend-item' : 'friend-item']">
            <n-icon class="left-icon" :component="Person"/>
            {{ item.username }}
            <span v-if="item.newMsgCount" class="message-tip">
              {{ item.newMsgCount }}
            </span>
          </div>
        </div>
        <div class="empty" v-else>
          absolutely empty
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
  <div class="bottom-btn">
    <n-button v-if="route.path === '/home/newroom'" quaternary type="primary" @click="handleBackToIndex">
      back to index
    </n-button>
    <n-button v-else quaternary type="primary" @click="handlePushCreate">
      i want to create room
    </n-button>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { Search, EllipsisHorizontal, Home, Person, EnterOutline } from '@vicons/ionicons5';
import socketio from 'socket.io-client'
import { useRouter, useRoute } from "vue-router";
import { getRoomList, entryRoom } from '../../api/room'
import bus from 'vue3-eventbus'

const room = ref('')
const router = useRouter()
const route = useRoute()
const userInfo = ref({})
const roomSelected = ref(null)
const friendSelected = ref(null)

const handleSelectPersion = (id) => {
  roomSelected.value = null
  friendSelected.value = id
}

const handleSelectRoom = (roomId) => {
  friendSelected.value = null
  roomSelected.value = roomId
  router.replace({ path: '/home/empty' })
  setTimeout(() => {
    router.replace({ path: '/home/room', query: { roomId: roomId }})
  }, 200)
}

const handleSearch = async () => {
  console.log('进入房间')
  const data = {
    roomId: room.value
  }
  const res = await entryRoom(data)
  if (res.code === 0) {
    router.replace({ path: '/home/empty' })
    setTimeout(() => {
      router.replace({ path: '/home/room', query: { roomId: res.data }})
      room.value = ''
    }, 200)
  }
}

const handleMore = () => {
  console.log('更多')
}

const handlePushCreate = () => {
  router.replace('/home/newroom')
}

const handleBackToIndex = () => {
  router.replace('/home')
}

const getRoomListFunc = async () => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  const data = {
    roomIdList: user.roomlist
  }
  const res = await getRoomList(data)
  if (res.code === 0) {
    res.data.forEach(item => { item.newMsgCount = 0 })
    user.roomlist = res.data
    userInfo.value = user
  }
}

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
    bus.emit('roomMessage', data)
  })
  bus.on('messageSend', (val) => {
    console.log(val)
    io.emit('sendMsg', val)
  })
}

onBeforeMount(async () => {
  await getRoomListFunc()
  initSocket()
})
</script>

<style lang="scss" scoped>
.enter-icon {
  cursor: pointer;
}
.avatar {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px;
  margin-top: 20px;
  border-radius: 15px;
  background: #27292e;
  width: calc(100% - 40px);

  .avatar-center {
    margin-left: 10px;
  }

  .name {
    font-size:18px;
    font-weight: bold;
    color: white;
  }

  .status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: #79d19c;
    margin-right: 5px;
  }

  .status {
    display: flex;
    align-items: center;
    font-size: 12px;
  }

  .avatar-more{
    position: absolute;
    right: 20px;
    top: 40px;
    cursor: pointer;
  }
}

.room {
  margin-top: 20px;

  .room-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 10px;
    padding: 5px 10px;
    margin-bottom: 5px;
    position: relative;
  }

  .room-item-active {
    background: #27292e;
  }
}

.friends {
  margin-top: 20px;

  .friend-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 10px;
    padding: 5px 10px;
    margin-bottom: 5px;
    position: relative;
  }

  .friend-item-active {
    background: #27292e;
  }
}

.message-tip {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #242424;
  border-radius: 10px;
  color: white;
  font-size: 10px;
  padding: 0 5px;
  font-weight: bold;
}

.left-icon {
  margin-right: 10px;
}

.empty {
  text-align: center;
  font-size: 14px;
  color: #8c8c8c;
}

.bottom-btn {
  width: 270px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  margin-bottom: 20px;
}

::v-deep(.n-collapse-item__header-main) {
  color: #424343 !important;
  font-size: 18px;
}
</style>