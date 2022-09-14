<template>
  <n-modal
    v-model:show="showModal"
    :close-on-esc="false"
    :mask-closable="false"
  >
    <n-card
      :style="`width: ${width}px; max-height: 700px;`"
      :title="title"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      closable
      @close="handleClose"
    >
      <slot />
    </n-card>
  </n-modal>
</template>

<script setup>
import { defineEmits } from 'vue'
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  width: {
    type: Number,
    default: 500,
  },
});
const emit = defineEmits(["close"])
const handleClose = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
:deep(.n-modal) {
  align-self: auto;
  margin: 0;
}
</style>