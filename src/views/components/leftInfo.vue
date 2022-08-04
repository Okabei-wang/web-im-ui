<template>
  <div class="search">
    <n-input round placeholder="Search for anything">
      <template #suffix>
        <n-icon :component="Search" class="search-icon" @click="handleSearch"/>
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
        <div v-if="userInfo.roomlist.length">
          <div v-for="item in userInfo.roomList" :key="item.roomId" @click="handleSelectRoom(item.roomId)" :class="[ roomSelected === item.roomId ? 'room-item-active room-item' : 'room-item']">
            <n-icon class="left-icon" :component="Home"/>
            {{ item.roomNumber }}
            <span class="message-tip">
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
        <div v-if="friendsList.length">
          <div v-for="item in friendsList" :key="item.id" @click="handleSelectPersion(item.id)" :class="[ friendSelected === item.id ? 'friend-item-active friend-item' : 'friend-item']">
            <n-icon class="left-icon" :component="Person"/>
            {{ item.realName }}
            <span class="message-tip">
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
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { Search, EllipsisHorizontal, Home, Person } from '@vicons/ionicons5';

const userInfo = ref({})
const roomSelected = ref(null)
const friendSelected = ref(null)

const roomList = ref([
  {
    roomId: 10001,
    roomNumber: 10001,
    newMsgCount: 5
  },
  {
    roomId: 10002,
    roomNumber: 10002,
    newMsgCount: 132
  },
  {
    roomId: 10003,
    roomNumber: 10003,
    newMsgCount: 19
  },
  {
    roomId: 10004,
    roomNumber: 10004,
    newMsgCount: 12
  }
])

const friendsList = ref([
  {
    id: 1,
    realName: 'Okabei',
    newMsgCount: 112
  },
  {
    id: 2,
    realName: 'DrLemonPie',
    newMsgCount: 6
  },
  {
    id: 3,
    realName: 'Libra',
    newMsgCount: 124
  },
  {
    id: 4,
    realName: '粑粑牛b',
    newMsgCount: 12
  }
])

const handleSelectPersion = (id) => {
  roomSelected.value = null
  friendSelected.value = id
}

const handleSelectRoom = (roomId) => {
  friendSelected.value = null
  roomSelected.value = roomId
}

const handleSearch = () => {
  console.log('搜索')
}

const handleMore = () => {
  console.log('更多')
}

onBeforeMount(() => {
  userInfo.value = JSON.parse(sessionStorage.getItem('userInfo'))
})
</script>

<style lang="scss" scoped>
.search-icon {
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

::v-deep(.n-collapse-item__header-main) {
  color: #424343 !important;
  font-size: 18px;
}
</style>