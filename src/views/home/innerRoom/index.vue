<template>
  <div class="innerRoom">
    <div class="content">
      <div class="room-top">
        <div class="top-left">
          <div class="room-name">
            <span>Okabei's room</span>
          </div>
          <div class="remark">
            <span>welcome to here.</span>
          </div>
        </div>
        <div class="top-right">
          <div class="room-member">
            <div v-for="item in room.memberlist" :key="item._id">
              <img class="member-avatar" :src="item.avatar">
            </div>
            <div class="member-more" v-if="room.memberlist.length > 3">
              <span>{{ room.memberlist.length }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="room-content">

      </div>
      <div class="send-box">

      </div>
    </div>
    <div class="room-detail">

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const room = ref({
  memberlist: [
    {
      _id: '62e8e4c998529e105e58cc65',
      username: 'DrLemonPie',
      role: 'user',
      avatar: 'https://img2.woyaogexing.com/2022/08/01/6a2c194af0aff873!400x400.png'
    },
    {
      _id: '62e8fc4298529e105e58cc66',
      username: 'OkabeiWang',
      role: 'user',
      avatar: 'https://imgsa.baidu.com/forum/pic/item/47d1a7efce1b9d165ef50303fcdeb48f8c5464bd.jpg'
    },
    {
      _id: '62e8e4c998529e105e58cc12',
      username: 'DrLemonPie',
      role: 'user',
      avatar: 'https://img2.woyaogexing.com/2022/08/01/6a2c194af0aff873!400x400.png'
    },
    {
      _id: '62e8fc4298529e105e58cc32',
      username: 'OkabeiWang',
      role: 'user',
      avatar: 'https://imgsa.baidu.com/forum/pic/item/47d1a7efce1b9d165ef50303fcdeb48f8c5464bd.jpg'
    }
  ],
  messageList: []
})

</script>

<style lang="scss" scoped>
.innerRoom {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  
  .content {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 65%;

    .room-top {
      width: calc(65% - 10px);
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
  }
}
</style>