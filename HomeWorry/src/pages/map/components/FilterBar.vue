<template>
  <div>
    <div class="search-bar">
      <button class="reset-btn bodyMedium14px" @click="reset">초기화</button>
      <FilterButton text="거래방식" @click="openSheet('roomtype')" />
      <FilterButton text="전용면적" @click="openSheet('area')" />
      
    </div>
    <BottomSheet :visible="sheetOpen" @close="sheetOpen = false">
    <template #title>
        {{ sheetType === 'roomtype' ? '거래방식' : sheetType === 'area' ? '전용면적' : '' }}
      </template>
      <template v-if="sheetType === 'roomtype'">
        <FilterOptionList :options="roomtypeOptions" @select="onRoomtypeSelect" />
      </template>
      <template v-if="sheetType === 'area'">
        <areaSlider @change="onAreaChange" />
      </template>
    </BottomSheet>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FilterButton from '@/pages/map/components/FilterButton.vue'
import BottomSheet from '@/pages/map/components/BottomSheet.vue'
import FilterOptionList from '@/pages/map/components/FilterOptionList.vue'
import AreaSlider from '@/pages/map/components/AreaSlider.vue'

const sheetOpen = ref(false)
const sheetType = ref('')

function openSheet(type) {
  sheetType.value = type
  sheetOpen.value = true
}

const roomtypeOptions = ['월세', '전세', '매매', '단기임대']
function onRoomtypeSelect(val) { /* ... */ }
function onAreaChange(val) { /* ... */ }
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  height: 60px;
  gap: 8px;
  padding: 0 8px;
  border-top: 1px solid var(--color-lightgray);
  border-bottom: 1px solid var(--color-lightgray);
}

</style>
