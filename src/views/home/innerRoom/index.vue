<template>
  <div class="innerRoom" :key="route.query.roomId">
    <div class="content">
      <div class="room-top">
        <div class="top-left">
          <div class="room-name">
            <span>{{ room.roomname }}</span>
          </div>
          <div class="remark">
            <span>(roomId: {{ room.roomId }})</span>
          </div>
        </div>
        <div class="top-right">
          <div class="room-member">
            <div v-for="(item, index) in room.memberlist" :key="index">
              <img class="member-avatar" :src="item.avatar">
            </div>
            <div class="member-more" v-if="room.memberlist.length > 3">
              <span>{{ room.memberlist.length }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="room-content">
        <div v-for="(item, index) in room.messageList" :key="index">
          <div class="messaage-item-me" v-if="item.userInfo._id === userInfo._id">
            <img class="avatar" :src="userInfo.avatar">
            <div>
              <div class="top">
                <span>{{ timestampToTimeFunc(item.time) }}</span>
                <span>You</span>
              </div>
              <div class="message">
                {{ item.content }}
              </div>
            </div>
          </div>
          <div class="messaage-item-other" v-else>
            <img class="avatar" :src="item.userInfo.avatar">
            <div>
              <div class="top">
                <span>{{ item.userInfo.username }}</span>
                <span>{{ timestampToTimeFunc(item.time) }}</span>
              </div>
              <div class="message">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="send-box">
        <n-input placeholder="Send message" type="textarea" :rows="1" v-model:value="message" @keyup="handleKeyUp" @keydown="handleKeyDown">
          <template #suffix>
            <n-icon :component="SendSharp" class="icon-send" @click="handleSendMessage"/>
          </template>
        </n-input>
      </div>
    </div>
    <div class="room-detail">
      <p class="detail-label">members：</p>
      <div class="detail-member">
        <div v-for="(item, index) in room.memberlist" :key="index">
          <img class="member-avatar" :src="item.avatar">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onBeforeMount, onMounted } from 'vue'
import { getRoomInfo, getRoomHistory } from '../../../api/room'
import { timestampToTime } from '../../../utils'
import { SendSharp } from '@vicons/ionicons5'
import bus from 'vue3-eventbus'

const route = useRoute()
const userInfo = ref(JSON.parse(sessionStorage.getItem('userInfo')))
const message = ref('')
const isCtrlDown = ref(false)
const room = ref({
  memberlist: [],
  messageList: []
})
const timestampToTimeFunc = (timeStamp) => {
  return timestampToTime(timeStamp)
}

const handleSendMessage = () => {
  bus.emit('messageSend', { content: message.value, type: 2, receiveId: route.query.roomId, sendUserId: userInfo.value._id, time: parseInt(new Date().getTime()) })
  message.value = ''
}
const getRoomInfoFunc = async () => {
  const data = {
    roomId: route.query.roomId
  }
  const res = await getRoomInfo(data)
  if (res.code === 0) {
    room.value = res.data
  }
}

const getRoomMessageHistory = async () => {
  const data = {
    roomId: route.query.roomId
  }
  const res = await getRoomHistory(data)
  if (res.code === 0) {
    room.value.messageList = res.data || []
  }
}

const initBusMessage = () => {
  bus.on('roomMessage', async (message) => {
    room.value.messageList.push(message)
    boxBottomFunc()
  })
}

const boxBottomFunc = () => {
  setTimeout(() => {
    document.querySelector('.room-content').scrollTop = document.querySelector('.room-content').scrollHeight
  }, 150)
}

onBeforeMount(async () => {
  await getRoomInfoFunc()
  await getRoomMessageHistory()
  initBusMessage()
})

onMounted(() => {
  boxBottomFunc()
})

const handleKeyUp = (val) => {
  if (val.which === 17) {
    isCtrlDown.value = false
  } else if (val.which === 13 && isCtrlDown.value) {
    // 换行
  } else if (val.which === 13) {
    handleSendMessage()
  }
}

const handleKeyDown = (val) => {
  if (val.which === 17) {
    isCtrlDown.value = true
  }
}
</script>

<style lang="scss" scoped>
.innerRoom {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  
  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 65%;

    .room-top {
      height: 35px;
      width: calc(100% - 10px);
      box-shadow: 0 3px 0px transparent;

      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;

      .top-left {
        display: flex;
        align-items: center;
        .room-name {
          font-size: 20px;
        }

        .remark {
          color: grey;
          margin-left: 10px;
        }
      }

      .top-right {
        .room-member {
          display: flex;

          .member-avatar {
            margin-right: 5px;
            width: 20px;
            height: 20px;
            border-radius: 5px;
          }

          .member-more {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 5px;
            background: rgb(71, 64, 64);
          }
        }
      }
    }

    .room-content {
      // background: rgb(136, 92, 92);
      margin-top: 45px;
      margin-bottom: 55px;
      height: calc(100% - 45px);
      overflow: auto;
      border-radius: 5px;
      display: flex;
      flex-direction: column;

      .messaage-item-me, .messaage-item-other {
        display: flex;
        padding: 2px;
        margin-bottom: 10px;

        .avatar {
          margin-right: 5px;
          width: 30px;
          height: 30px;
          border-radius: 5px;
        }
      }

      .messaage-item-me {
        display: flex;
        flex-direction: row-reverse;
        
        .top {
          span {
            &:nth-child(2) {
              font-size: 1rem;
              margin-right: 5px;
            }
            &:nth-child(1) {
              font-size: 0.8rem;
              margin-right: 8px;
              color: #f8819d
            }
          }
        }

        .message {
          padding: 6px 10px;
          background: rgb(163, 74, 245);
          border-radius: 20px;
          margin-right: 8px;
          border-top-right-radius: 0%;
        }
      }

      .messaage-item-other {
        .top {
          span {
            &:nth-child(1) {
              font-size: 1rem;
              margin-right: 5px;
            }
            &:nth-child(2) {
              font-size: 0.8rem;
              margin-right: 8px;
              color: #f8819d
            }
          }
        }

        .message {
          padding: 6px 10px;
          background: #4c2730;
          border-radius: 20px;
          margin-right: 8px;
          border-top-left-radius: 0%;
        }
      }
    }

    .send-box {
      position: absolute;
      bottom: 0;
      left: 0;
      background: #27292e;
      height: 45px;
      width: 100%;
      margin: 5px 0;
      border-radius: 5px;
      display: flex;
      .icon-send {
        cursor: pointer;
      }
    }
  }

  .room-detail {
    padding: 5px;
    width: 32%;
    margin-left: 3%;
    height: 100%;
    border-radius: 15px;
    background: #191b1d;
    .detail-label {
      font-size: 1rem;
    }
    .detail-member {
      padding-left: 5px;
      display: flex;
      .member-avatar {
        margin-right: 5px;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 5px;
      }
    }
  }
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.01);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.01);
  background-color: rgb(130, 130, 130);
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: rgb(85, 85, 85);
}
::-webkit-scrollbar {
  width: 2px;
  height: 6px;
  background-color: rgb(127, 127, 127);
}
</style>