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
  width: 175px;
  height: 73px;
  text-align: center;
  padding: 0;
  line-height: 73px;
  background-color: #ffffff;
  border: 1px solid var(--color-lightgray);
  color: var(--color-primary);
  transition: all 0.2s ease-in-out;
}

.btn-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.btn-text {
  text-align: left;
  margin-left: 18px;
  flex-grow: 1;
  height: 100%;
  display: flex;
  align-items: center;
}

.btn-icon {
  width: 40px;
  height: 40px;
  margin-right: 5px;
  flex-shrink: 0;
}

.btn-lgshort-wrapper:hover {
  border-color: var(--color-primary);
}
</style>
