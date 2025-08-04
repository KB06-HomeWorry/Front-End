<template>
  <div class="review-textarea-wrap">
    <div class="q-text bodyMedium14px">
      ▷ 추가로 남기고 싶은 말 (필수, {{ maxlength }}자 이내)
    </div>

    <textarea
      :value="modelValue"
      @input="onInput"
      :maxlength="maxlength"
      :rows="rows"
      class="review-textarea bodyLight12px"
      :placeholder="placeholder"
    />

    <div class="comment-length-info bodyLight10px">
      {{ modelValue.length }}/{{ maxlength }}
      <span
        v-if="minlength && modelValue.length > 0 && modelValue.length < minlength"
        class="warn-msg bodyMedium10px"
      >
        {{ minlength }}자 이상 입력 필요
      </span>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: "" },
  maxlength:  { type: Number, default: 300 },
  minlength:  { type: Number, default: 10 },
  rows:       { type: Number, default: 4 },
  placeholder: { type: String, default: "자유롭게 후기를 남겨주세요. (최소 10자)" }
})
const emit = defineEmits(['update:modelValue'])
function onInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<style scoped>
.review-textarea-wrap {
  margin-bottom: 24px;
}

/* 타이틀 라벨 */
.q-text {
  margin-bottom: 8px;
  display: block;
  line-height: 1.6;
  word-break: keep-all;
  letter-spacing: -0.03em;
}

/* input 박스 심플 스타일 */
.review-textarea {
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

.review-textarea::placeholder {
  font-size: 0.75rem;
  font-family: 'GmarketSansLight', sans-serif;
  color: var(--color-mediumgray);
  opacity: 1;
}

/* 글자수 info (우하단) */
.comment-length-info {
  text-align: right;
  color: var(--color-mediumgray);
  margin-right: 2px;
  margin-top: -6px;
  margin-bottom: 2px;
}
.warn-msg {
  color: var(--color-danger);
  margin-left: 8px;
}
</style>
