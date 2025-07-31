<template>
  <div class="estatetext-textarea-wrap">
    <div class="q-text bodyMedium14px">
      ▷ 이해하기 어려운 부동산 문장을 입력해 주세요.
    </div>

    <textarea
      :value="modelValue"
      @input="onInput"
      :maxlength="maxlength"
      :rows="rows"
      class="estatetext-textarea bodyLight12px"
      :placeholder="placeholder"
    />

    <div class="estatetext-length-info bodyLight10px">
      {{ modelValue.length }}/{{ maxlength }}
      <span
        v-if="
          minlength && modelValue.length > 0 && modelValue.length < minlength
        "
        class="warn-msg"
      >
        {{ minlength }}자 이상 입력 필요
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  maxlength: { type: Number, default: 300 },
  minlength: { type: Number, default: 10 },
  rows: { type: Number, default: 4 },
  placeholder: {
    type: String,
    default: '예: 본 임대차계약에 따라 임차인은 전대차를 할 수 없습니다.',
  },
});
const emit = defineEmits(['update:modelValue']);
function onInput(e) {
  emit('update:modelValue', e.target.value);
}
</script>

<style scoped>
.estatetext-textarea-wrap {
  margin-bottom: 24px;
}

.q-text {
  margin-bottom: 8px;
  display: block;
  line-height: 1.6;
  word-break: keep-all;
  letter-spacing: -0.03em;
}

.estatetext-textarea {
  width: 100%;
  min-height: 64px;
  border-radius: 8px;
  border: 1px solid var(--color-mediumgray);
  resize: none;
  padding: 10px;
  background: #fff;
  box-sizing: border-box;
  margin-bottom: 6px;
}

.estatetext-textarea::placeholder {
  color: var(--color-mediumgray);
}

.estatetext-length-info {
  text-align: right;
  color: var(--color-mediumgray);
  margin-right: 2px;
  margin-top: -6px;
  margin-bottom: 2px;
}
.warn-msg {
  color: var(--color-warn, #e43a3a);
  margin-left: 8px;
}
</style>
