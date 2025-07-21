<template>
  <header class="header">
    <div class="left">
      <h1 :class="showChecklistTitle ? 'bodyMedium20px' : 'titleBold24px'">
        {{ showChecklistTitle ? `${type} 계약 체크리스트` : '집걱정단' }}
      </h1>
    </div>
    <div class="right" v-if="showChecklistTitle">
      <button class="reset-btn titleBold12px" @click="handleReset">
        초기화
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const showChecklistTitle = computed(() => route.path.startsWith('/checklist'));
const type = computed(() => route.query.type || '');
const stage = computed(() => route.query.stage || '');

const handleReset = () => {
  console.log('초기화 버튼 클릭됨');
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--color-white);
  z-index: 100;
  max-width: 390px;
  width: 100%;
  margin: 0 auto;
  border-bottom: 0.5px solid var(--color-light);
  padding: 0 16px;
}

.left h1 {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reset-btn {
  border-radius: 12px;
  width: 58px;
  height: 24px;
  line-height: 24px;
  padding: 0;
  border: none;
  color: var(--color-white);
  background-color: var(--color-primary);
  transition: var(--transition);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
