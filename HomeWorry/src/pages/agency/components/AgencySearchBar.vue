<template>
  <!-- 중개사 검색 바 -->
  <div class="agency-search-bar">
    <div class="search-input-wrapper">
      <input
        type="text"
        class="search-input bodyMedium14px"
        v-model="searchText"
        @keyup.enter="onSearch"
        placeholder="이름 또는 지역을 입력하세요"
      />
      <button class="icon-btn" type="button" @click="onSearch" aria-label="검색">
        <img :src="searchIcon" alt="검색" class="search-icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import searchIcon from "@/assets/icons/search_dark.png"

const emit = defineEmits(["search"])

const searchText = ref("")

// 공백을 제거한 검색어를 부모로 전달
function onSearch() {
  emit("search", searchText.value.trim())
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
}

.search-input {
  width: 100%;
  flex: 1;
  height: 40px;
  border: 1px solid var(--color-lightgray);
  border-radius: 12px;
  padding: 0 40px 0 14px; /* 오른쪽 아이콘 영역 확보 */
  outline: none;
  line-height: 40px;
}

.search-input::placeholder {
  font-size: 12px;
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
