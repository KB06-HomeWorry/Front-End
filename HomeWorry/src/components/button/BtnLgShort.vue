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
  height: 74px;
  text-align: center;
  padding: 0;
  line-height: 74px;
  background-color: #ffffff;
  border: 1px solid var(--color-lightgray);
  color: var(--color-primary);
  transition: all 0.1s ease-in-out;
}

.btn-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.btn-text {
  text-align: left;
  margin-left: 11px;
  flex-grow: 1;
  height: 100%;
  display: flex;
  align-items: center;
  padding-top: 1px;    /* 텍스트가 중앙에 맞지 않아서 강제로 부여함 */
}

.btn-icon {
  width: 40px;
  height: 40px;
  margin-right: 4px;
  flex-shrink: 0;
  transform: scaleX(-1);
  filter: drop-shadow(0 3px 3px rgba(0,0,0,0.25))
}

.btn-lgshort-wrapper:hover {
  border : 1.5px solid var(--color-primary);
  /* border-color: var(--color-primary); */
}
</style>
