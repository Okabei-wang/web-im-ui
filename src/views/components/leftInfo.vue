<template>
  <div class="search">
    <n-input v-model:value="room" round placeholder="Search into a room">
      <template #suffix>
        <n-icon
          :component="EnterOutline"
          class="enter-icon"
          @click="handleSearch"
        />
      </template>
    </n-input>
  </div>
  <div class="avatar">
    <n-avatar size="medium" :src="myUserInfo.avatar" />
    <div class="avatar-center">
      <div class="name">{{ myUserInfo.username }}</div>
      <div class="status">
        <span class="status-icon">
          <n-icon
            size="10"
            :component="EllipsisHorizontal"
            @click="handleMore"
          />
        </span>
        Achive for chat
      </div>
    </div>
    <n-dropdown :options="options" @select="handleSelect">
      <n-icon :component="EllipsisHorizontal" class="avatar-more" />
    </n-dropdown>
  </div>
  <div class="room">
    <n-collapse>
      <n-collapse-item title="Room List">
        <div v-if="myUserInfo.roomlist && myUserInfo.roomlist.length">
          <div
            v-for="item in myUserInfo.roomlist"
            :key="item.roomId"
            @click="handleSelectRoom(item._id)"
            :class="[
              roomSelected === item._id
                ? 'room-item-active room-item'
                : 'room-item',
            ]"
          >
            <n-icon class="left-icon" :component="Home" />
            {{ item.roomname }}
            <span class="message-tip" v-if="item.newMsgCount">
              {{ item.newMsgCount }}
            </span>
          </div>
        </div>
        <div class="empty" v-else>absolutely empty</div>
      </n-collapse-item>
    </n-collapse>
  </div>
  <div class="friends">
    <n-collapse>
      <n-collapse-item title="Friends List">
        <div v-if="myUserInfo.friends && myUserInfo.friends.length">
          <div
            v-for="item in myUserInfo.friends"
            :key="item.id"
            @click="handleSelectPerson(item._id)"
            :class="[
              friendSelected === item.id
                ? 'friend-item-active friend-item'
                : 'friend-item',
            ]"
          >
            <n-icon class="left-icon" :component="Person" />
            {{ item.username }}
            <span v-if="item.newMsgCount" class="message-tip">
              {{ item.newMsgCount }}
            </span>
          </div>
        </div>
        <div class="empty" v-else>absolutely empty</div>
      </n-collapse-item>
    </n-collapse>
  </div>
  <div class="bottom-btn">
    <n-button
      v-if="route.path === '/home/newroom'"
      quaternary
      type="primary"
      @click="handleBackToIndex"
    >
      back to index
    </n-button>
    <n-button v-else quaternary type="primary" @click="handlePushCreate">
      i want to create room
    </n-button>
    <n-popover trigger="hover">
      <template #trigger>
        <n-icon
          :component="Search"
          class="search-icon"
          @click="handleFindFriend"
        />
      </template>
      <span>find friend</span>
    </n-popover>
  </div>
  <Dialog
    :width="600"
    :show-modal="dialogVisible"
    :title="title"
    @close="handleCloseDialog"
  >
    <div v-if="dialogType === 'avatar'" class="input">
      <n-space vertical>
        <n-input
          v-model:value="dialog.avatar"
          placeholder="请输入您新的头像地址（是地址哦~）"
        />
      </n-space>
    </div>
    <div v-if="dialogType === 'findFriend'">
      <div class="search-box">
        <n-input
          class="search-nickname"
          v-model:value="nickName"
          placeholder="请输入对方昵称"
        ></n-input>
        <n-button :disabled="isRequest" @click="handleSearchFriend"
          >搜索</n-button
        >
      </div>
      <n-data-table
        max-height="300"
        :columns="columns"
        :data="tableData"
        :bordered="false"
      />
    </div>
    <div v-if="dialogType === 'invitMessage'">
      {{ invitData.userInfo.username }}申请添加您为好友
    </div>
    <div class="dialog-footer">
      <n-button
        v-if="dialogType === 'avatar'"
        class="footer-btn"
        @click="handleConfirm"
        :disabled="isRequest"
        >确 认</n-button
      >
      <n-button
        v-if="dialogType === 'invitMessage'"
        class="footer-btn"
        @click="handleAgree"
        >同 意</n-button
      >
      <n-button
        v-if="dialogType === 'invitMessage'"
        class="footer-btn"
        @click="handleRefuse"
        >拒 绝</n-button
      >
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onBeforeMount, h } from "vue";
import { serverHost } from "../../api/server"
import {
  Search,
  EllipsisHorizontal,
  Home,
  Person,
  EnterOutline,
} from "@vicons/ionicons5";
import socketio from "socket.io-client";
import { useRouter, useRoute } from "vue-router";
import { getRoomList, entryRoom } from "../../api/room";
import {
  userInfo,
  getFriendList,
  updateAvatar,
  searchUser,
} from "../../api/login";
import { agreeInvite } from "../../api/friend";
import { UserStore } from "../../store/modules/user";
import Dialog from "../../components/Dialog/index.vue";
import bus from "vue3-eventbus";
import { NButton, NImage } from "naive-ui";

const dialog = ref({
  avatar: "",
});
const invitData = ref({});
const isRequest = ref(false);
const title = ref("");
const dialogType = ref("");
const dialogVisible = ref(false);
const userStore = UserStore();
const room = ref("");
const router = useRouter();
const route = useRoute();
const myUserInfo = ref({});
const roomSelected = ref(null);
const friendSelected = ref(null);
const options = [{ label: "编辑头像", key: "avatar" }];
const tableData = ref([]);
const nickName = ref("");
const createColumns = ({ play }) => {
  return [
    {
      title: "Avatar",
      key: "avatar",
      render(row) {
        return h(NImage, {
          width: 40,
          height: 40,
          style: "margin-right: 5px",
          src: row.avatar,
        });
      },
    },
    {
      title: "Friend",
      key: "friends",
      render(row) {
        return row.friends.length;
      },
    },
    {
      title: "Action",
      key: "actions",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => play(row),
          },
          { default: () => "添加好友" }
        );
      },
    },
  ];
};
const columns = createColumns({
  play(row) {
    $message.info(`已向${row.username}发送好友邀请`);
    const data = {
      content: "",
      sendUserId: myUserInfo.value._id,
      receiveId: row._id,
      time: new Date().getTime(),
      type: 4,
    };
    bus.emit("messageSend", data);
  },
});
const pagination = false;

const handleAgree = async () => {
  isRequest.value = true;
  const data = invitData.value;
  const res = await agreeInvite(data);
  if (res.code === 0) {
    $message.success("操作成功");
    const info = userStore.getInfo();
    info.friend.push(invitData.sendUserId);
    userStore.setInfo(info)
    dialogVisible.value = false
  }
  isRequest.value = false;
};

const handleRefuse = () => {
  handleCloseDialog()
};

const handleSearchFriend = async () => {
  isRequest.value = true;
  const data = {
    nickName: nickName.value,
  };
  const res = await searchUser(data);
  if (res.code === 0) {
    tableData.value = res.data;
  }
  isRequest.value = false;
};

const handleFindFriend = () => {
  // 添加好友
  dialogType.value = "findFriend";
  title.value = "添加好友";
  dialogVisible.value = true;
};

const handleConfirm = async () => {
  isRequest.value = true;
  if (dialogType.value === "avatar") {
    const data = {
      avatar: dialog.value.avatar,
    };
    const res = await updateAvatar(data);
    if (res.code === 0) {
      $message.success("修改成功");
      refreshUserInfo();
      dialogVisible.value = false;
    }
  } else if (dialogType.value === "findFriend") {
  }
  isRequest.value = false;
};

const handleSelectPerson = (id) => {
  roomSelected.value = null;
  friendSelected.value = id;
  console.log(id)
  router.replace({ path: "/home/empty" });
  setTimeout(() => {
    router.replace({ path: "/home/friend", query: { friendId: id } });
  }, 200);
};

const handleSelectRoom = (roomId) => {
  friendSelected.value = null;
  roomSelected.value = roomId;
  router.replace({ path: "/home/empty" });
  setTimeout(() => {
    router.replace({ path: "/home/room", query: { roomId: roomId } });
  }, 200);
};

const handleCloseDialog = () => {
  dialogVisible.value = false;
};

const handleSelect = (val) => {
  if (val === "avatar") {
    // 编辑头像
    dialogType.value = val;
    title.value = "编辑头像";
    dialogVisible.value = true;
  }
};

const refreshUserInfo = async () => {
  const res = await userInfo();
  if (res.code === 0) {
    const friends = await initFriendList(res.data.friends);
    const data = {
      roomIdList: res.data.roomlist,
    };
    const rmRes = await getRoomList(data);
    if (rmRes.code === 0) {
      res.data.roomlist = rmRes.data;
    }
    res.data.friends = friends;
    userStore.setInfo(res.data);
    myUserInfo.value = res.data;
  }
};

const initFriendList = async (friendsIdList) => {
  const res = await getFriendList(friendsIdList);
  if (res.code === 0) {
    for (let i in res.data) {
      res.data[i].newMsgCount = 0;
    }
    return res.data;
  }
};

const handleSearch = async () => {
  console.log("进入房间");
  const data = {
    roomId: room.value,
  };
  const res = await entryRoom(data);
  if (res.code === 0) {
    router.replace({ path: "/home/empty" });
    setTimeout(() => {
      router.replace({ path: "/home/room", query: { roomId: res.data } });
      room.value = "";
      refreshUserInfo();
    }, 200);
  }
};

const handleMore = () => {
  console.log("handleMore");
};

const handlePushCreate = () => {
  router.replace("/home/newroom");
};

const handleBackToIndex = () => {
  router.replace("/home");
};

const getRoomListFunc = async () => {
  const user = userStore.getInfo;
  const data = {
    roomIdList: user.roomlist,
  };
  const res = await getRoomList(data);
  if (res.code === 0) {
    res.data.forEach((item) => {
      item.newMsgCount = 0;
    });
    user.roomlist = res.data;
    myUserInfo.value = user;
  }
};

const initSocket = () => {
  let io = socketio(serverHost, {
    //transports和服务端统一，否则会跨域
    transports: ["websocket"],
  });
  //向服务端发送消息
  const info = userStore.getInfo;
  io.emit("login", { userId: info._id, username: info.username });
  io.on("message", (data) => {
    console.log("message: ", data);
    if (data.type === 1) {
      bus.emit("friendMessage", data);
    } else if (data.type === 2) {
      // 房间消息
      bus.emit("roomMessage", data);
    } else if (data.type === 4) {
      // 好友邀请消息
      if (data.receiveId === myUserInfo.value._id) {
        invitData.value = data;
        dialogType.value = "invitMessage";
        title.value = "新的好友申请";
        dialogVisible.value = true;
      }
    }
  });
  bus.on("messageSend", (val) => {
    console.log(val);
    io.emit("sendMsg", val);
  });
};

const getMessageListFunc = async () => {

}

onBeforeMount(async () => {
  await getRoomListFunc();
  await getMessageListFunc();
  initSocket();
});
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
    font-size: 18px;
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

  .avatar-more {
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
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  .footer-btn {
    width: 100px;
  }
}
.input {
  margin-bottom: 20px;
}

.search-icon {
  cursor: pointer;
}

.search-box {
  width: 100%;
  display: flex;
  margin-bottom: 10px;
  .search-nickname {
    width: 200px;
    margin-right: 20px;
  }
}

::v-deep .n-data-table-tbody {
  max-height: 350px !important;
  overflow: auto;
}
.avt40 {
  width: 40px;
  height: 40px;
}
</style>
