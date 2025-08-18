<template>
  <div class="review-question-wrap">
    <div class="question-title-flex">
      <span class="q-number bodyMedium14px">{{ index + 1 }}.</span>
      <span class="q-text bodyMedium14px">{{ question }}</span>
    </div>

    <div class="choices-row">
      <ReviewChoice
        v-for="(c, idx) in choices"
        :key="c.type"
        :type="c.type"
        :label="c.label"
        :emoji="c.emoji"
        :text="c.text"
        :selected="modelValue === idx"
        @click="select(idx)" 
      />
    </div>
  </div>
</template>

<script setup>
import ReviewChoice from '@/pages/agency/components/ReviewChoice.vue'

const props = defineProps({
  index: { type: Number, required: true },
  question: { type: String, required: true },
  choices: { type: Array, required: true },
  modelValue: { type: Number, default: null }
})

const emit = defineEmits(['update:modelValue'])

function select(idx) {
  emit('update:modelValue', idx)
}
</script>

<style scoped>
.review-question-wrap {
  margin-bottom: 24px;
}

.question-title-flex {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.q-number {
  flex-shrink: 0;
  min-width: 22px;
  font-weight: bold;
  text-align: right;
  line-height: 1.6;
}

.q-text {
  flex: 1;
  line-height: 1.6;
  word-break: keep-all;
  letter-spacing: -0.03em;
}

.choices-row {
  display: flex;
  flex-direction: column;
}
</style>
