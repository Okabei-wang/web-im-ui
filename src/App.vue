<template>
  <div>
    <n-message-provider>
      <Message />
    </n-message-provider>
    <n-config-provider
      :theme="theme"
    >
      <router-view></router-view>
    </n-config-provider>
  </div>
</template>

<script setup>
import { darkTheme } from "naive-ui";
import Message from "./components/Message/index.vue"

const theme = darkTheme
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
