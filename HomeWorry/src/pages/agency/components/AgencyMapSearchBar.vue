<template>
  <div>
    <div class="search-bar bodyMedium14px">
      <LocationSearch class="search-input-left" @search="onSearch" />
    </div>
  </div>
</template>

<script setup>
import LocationSearch from "@/components/input/SearchInput.vue";

const emit = defineEmits(["search"]);

function onSearch(keyword) {
  emit("search", keyword);
}
</script>

<style scoped>
.search-bar {
  width: 393px;
  display: flex;
  align-items: center;
  height: 50px;
  gap: 8px;
  padding: 0 8px;
  border-bottom: 1px solid var(--color-lightgray);
  background: var(--color-white);
}
</style>