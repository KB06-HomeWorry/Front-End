<template>
  <div class="agency-search-bar">
    <div class="search-input-wrapper">
      <input
        type="text"
        class="search-input bodyMedium14px"
        v-model="searchText"
        @keyup.enter="onSearch"
        placeholder="중개사무소 이름 입력"
      />

      <button class="icon-btn" @click="onSearch" aria-label="검색">
        <img src="@/assets/icons/search_dark.png" alt="검색" class="search-icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['search'])
const searchText = ref('')

function onSearch() {
  emit('search', searchText.value.trim())
}
</script>

<style scoped>
.agency-search-bar {
  width: 50%;
  background: #fff;
  padding: 0;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
    position: relative;
}

.search-input {
    width: 100%;
  flex: 1;
  height: 40px;
  border: 1px solid var(--color-lightgray);
  border-radius: 12px;
  padding: 0 40px 0 14px; /* 오른쪽 아이콘 영역 확보 */
  /* background: #fafbfc; */
  outline: none;
    line-height: 40px;
}

.search-input::placeholder {
  font-size: 14px;
  color: var(--color-mediumgray);
}

.icon-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
}

.search-icon {
  width: 20px;
  height: 20px;
  display: block;
}
</style>
