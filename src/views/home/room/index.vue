<template>
  <div>
    <div class="title">Create a new room, please input the room name !</div>
    <n-input type="text" class="create-input" v-model:value="roomname" size="medium" placeholder="please input the room name" />
    <div>
      <n-button strong secondary type="primary" :loading="loading" @click="createRoomInpage">create</n-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { createRoom } from '../../../api/room'
import { UserStore } from '../../../store/modules/user';

const router = useRouter()
const userStore = UserStore()
const roomname = ref('')
const loading = ref(false)
const userInfo = ref({})

const createRoomInpage = async () => {
  // 创建房间
  loading.value = true
  const data = {
    admin: userInfo.value._id,
    roomname: roomname.value
  }
  const res = await createRoom(data)
  if(res.code === 0) {
    // 创建成功
    $message.success('创建成功')
    // 进入该房间
    router.push({ path: '/home/room', query: { roomId: res.data } })
  }
  loading.value = false
}

onBeforeMount(() => {
  userInfo.value = userStore.getInfo
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 1.5vw;
}
.create-input {
 margin: 10px 0;
  width: 300px;
}
</style>