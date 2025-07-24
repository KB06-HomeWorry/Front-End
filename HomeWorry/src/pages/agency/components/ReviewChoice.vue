<template>
  <div
    :class="['choice-box', type, { selected }]"
    @click="handleClick"
    role="button"
    tabindex="0"
  >
    <div class="choice-left">
      <span class="choice-label bodyMedium10px">{{ label }}</span>
      <span class="choice-emoji bodyMedium10px">{{ emoji }}</span>
      <span class="choice-slash bodyMedium10px" :class="type">|</span>
    </div>
    <span class="choice-text bodyMedium12px">{{ text }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  type: { type: String, required: true },
  label: { type: String, required: true },
  emoji: { type: String, required: true },
  text: { type: String, required: true },
  selected: { type: Boolean, default: false }
})
const emit = defineEmits(['select'])

function handleClick() {
  emit('select')
}
</script>

<style scoped>
.choice-box {
  width: 100%;
  /* min-width: 329px; */
  height: 35px;
  display: flex;
  align-items: center;
  line-height: 10px;
  border-radius: 12px;
  border: 1px solid var(--color-light);
  padding-left: 4px;
  margin-bottom: 4px;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;
}

.choice-box:hover {
  border: 1.2px solid var(--color-primary);
  color: var(--color-primary);
  background: rgba(17, 31, 92, 0.1);
}

.choice-box.selected {
  border: 1px solid var(--color-primary);
  background: rgba(17, 31, 92, 0.1);

}

.choice-left {
  display: flex;
  align-items: center;
  width: 58px;
  flex-shrink: 0; 
  gap: 2px;
  justify-content: flex-end; 
}

.choice-text {
  width: 100%;
  letter-spacing: -0.03em;
  text-align: center;
  color: var(--color-primary);
}

.good .choice-label  { color: var(--color-primary); }
.soso .choice-label  { color: var(--color-mediumgray); }
.bad .choice-label   { color: #961212; }

.choice-slash.good  { color: var(--color-primary); }
.choice-slash.soso  { color: var(--color-mediumgray); }
.choice-slash.bad   { color: #961212; }
</style>
