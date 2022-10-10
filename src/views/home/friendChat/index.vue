<template>
  <div class="innerfriend" :key="route.query.friendId">
    <div class="content">
      <div class="friend-top">
        <div class="top-left">
          <!-- <div class="remark">
            <img class="friend-avatar" :src="friend.avatar" />
          </div> -->
          <div class="friend-name">
            <span>{{ friend.username }}</span>
          </div>
        </div>
      </div>
      <div class="friend-content">
        <div v-for="(item, index) in friend.messageList" :key="index">
          <div
            class="messaage-item-me"
            v-if="item.userInfo._id === userInfo._id"
          >
            <img class="avatar" :src="userInfo.avatar" />
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
            <img class="avatar" :src="item.userInfo.avatar" />
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
        <n-input
          placeholder="Send message"
          type="textarea"
          :autosize="{
            minRows: 1,
            maxRows: 3,
          }"
          v-model:value="message"
          @keydown="handleKeyDown"
        >
          <template #suffix>
            <n-icon
              :component="SendSharp"
              class="icon-send"
              @click="handleSendMessage"
            />
          </template>
        </n-input>
      </div>
    </div>
    <div class="friend-detail">
      something details(No content for now)
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onBeforeMount, onMounted } from "vue";
import { getFriendInfo, getFriendHistory } from "../../../api/friend";
import { timestampToTime } from "../../../utils";
import { SendSharp } from "@vicons/ionicons5";
import { UserStore } from "../../../store/modules/user";
import bus from "vue3-eventbus";

const userStore = UserStore();
const route = useRoute();
const userInfo = ref({});
const message = ref("");
const friend = ref({
  messageList: [],
});
const timestampToTimeFunc = (timeStamp) => {
  return timestampToTime(timeStamp);
};

const handleSendMessage = () => {
  if (message.value === '') {
    $message.error('请输入发送内容')
    return
  }
  bus.emit("messageSend", {
    content: message.value,
    type: 1,
    receiveId: route.query.friendId,
    sendUserId: userInfo.value._id,
    time: parseInt(new Date().getTime()),
  });
  message.value = "";
};
const getFriendInfoFunc = async () => {
  const data = {
    friendId: route.query.friendId,
  };
  const res = await getFriendInfo(data);
  if (res.code === 0) {
    friend.value = res.data;
  }
};

const getFriendMessageHistory = async () => {
  const data = {
    friendId: route.query.friendId,
    userId: userInfo.value._id
  };
  const res = await getFriendHistory(data);
  if (res.code === 0) {
    friend.value.messageList = res.data || [];
  }
};

const initBusMessage = () => {
  bus.on("friendMessage", async (message) => {
    if (message.receiveId === friend.value._id || message.receiveId === userInfo.value._id) {
      friend.value.messageList.push(message);
      boxBottomFunc();
    }
  });
};

const boxBottomFunc = () => {
  setTimeout(() => {
    document.querySelector(".friend-content").scrollTop =
      document.querySelector(".friend-content").scrollHeight;
  }, 150);
};

onBeforeMount(async () => {
  userInfo.value = userStore.getInfo;
  await getFriendInfoFunc();
  await getFriendMessageHistory();
  initBusMessage();
});

const handleKeyDown = (val) => {
  if (!val.shiftKey && val.keyCode == 13) {
    val.cancelBubble = true; // ie阻止冒泡行为
    val.stopPropagation(); // firefox阻止冒泡行为
    val.preventDefault(); // 取消事件的默认动作 换行
    // 发送消息
    handleSendMessage();
  }
};

onMounted(() => {
  boxBottomFunc();
});
</script>

<style lang="scss" scoped>
.innerfriend {
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

    .friend-top {
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
        .friend-name {
          font-size: 20px;
        }

        .remark {
          color: grey;
          margin-left: 10px;

          .friend-avatar {
            margin-right:10px;
            width: 30px;
            height: 30px;
            border-radius: 5px;
          }
        }
      }

      .top-right {
        .friend-member {
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

    .friend-content {
      // background: rgb(136, 92, 92);
      margin-top: 45px;
      margin-bottom: 55px;
      height: calc(100% - 45px);
      overflow: auto;
      border-radius: 5px;
      display: flex;
      flex-direction: column;

      .messaage-item-me,
      .messaage-item-other {
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
              color: #f8819d;
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
              color: #f8819d;
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

  .friend-detail {
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
