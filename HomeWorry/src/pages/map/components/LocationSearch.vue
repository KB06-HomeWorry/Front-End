<template>
  <div class="map-search-bar">
    <div class="search-input-wrapper">
      <input
        type="text"
        class="search-input bodyMedium12px"
        v-model="searchText"
        @keyup.enter="onSearch"
        placeholder="단지명, 역명, 지역명"
      />
      <button class="icon-btn" @click="onSearch" aria-label="검색">
        <img src="@/assets/icons/search_light.png" alt="검색" class="search-icon" />
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
.map-search-bar {
  flex: 1 0 160px; 
  min-width: 160px; 
  background: #fff;
  padding: 0;
  display: flex;
  align-items: center;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.search-input {
  width: 100%;
  height: 35px;
  border: 1.2px solid var(--color-mediumgray);
  border-radius: 12px;
  padding: 3px 36px 0 14px;
  outline: none;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: var(--color-mediumgray);
}

.icon-btn {
  position: absolute;
  right: 8px;
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
  width: 16px;
  height: 16px;
}
</style>
