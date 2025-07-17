<template>
  <button class="btn-lgshort-wrapper titleBold20px" @click="$emit('click')">
    <div class="btn-content">
      <span class="btn-text">{{ text }}</span>
      <template v-if="icon">
        <img :src="icon" alt="icon" class="btn-icon" />
      </template>
    </div>
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: null,
  },
});

defineEmits(['click']);
</script>

<style scoped>
.btn-lgshort-wrapper {
  border-radius: 12px;
  width: 176px;
  height: 156px;
  text-align: center;
  padding: 0;
  line-height: 74px;
  background-color: #ffffff;
  border: 1px solid var(--color-lightgray);
  color: var(--color-black);
  transition: all 0.2s ease-in-out;
  position: relative;
  padding: 18px 16px 16px 18px;
  box-sizing: border-box;
  overflow: hidden;
  text-align: left;
}

/* .btn-content {
  display: flex;
  align-items: center;
  width: 100%;
} */

.btn-text {
  position: absolute;
  left: 18px;
  top: 4px;
  font-size: 20px;
  color: var(--color-primary);
  z-index: 1;
}

.btn-icon {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 44px;
  height: 44px;
  z-index: 1;
}

.btn-lgshort-wrapper:hover {
  outline: 1.5px solid var(--color-primary);
  /* border-color: var(--color-primary); */
}
</style>
