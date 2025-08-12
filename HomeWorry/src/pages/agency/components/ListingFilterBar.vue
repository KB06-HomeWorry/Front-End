<template>
  <div class="filter-bar">
    <!-- 세그먼트 캡슐 안에 4개 버튼 -->
    <div class="tabs bodyMedium12px">
      <button
        v-for="t in typeTabs"
        :key="t.value"
        class="tab"
        :class="{ active: localActive === t.value }"
        @click="selectTab(t.value)"
        :aria-pressed="localActive === t.value"
      >
        {{ t.label }}
      </button>
    </div>

    <SortSelect
      class="sort-host"
      v-model="localSort"
      :options="sortOptions"
      @change="emitSort"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import SortSelect from '@/pages/agency/components/SortSelect.vue'

const props = defineProps({
  modelValueTypes: { type: Array, default: () => ['MONTHLY','JEONSE','SALE'] },
  modelValueSort:  { type: String, default: 'server' },
})
const emit = defineEmits(['update:modelValueTypes','update:modelValueSort'])

const typeTabs = [
  { label: '전체', value: 'ALL' },
  { label: '월세', value: 'MONTHLY' },
  { label: '전세', value: 'JEONSE' },
  { label: '매매', value: 'SALE' },
]
const ALL_TYPES = ['MONTHLY','JEONSE','SALE']

const localActive = ref('ALL')
const localSort   = ref(props.modelValueSort)

const sortOptions = [
  { value: 'server',   label: '기본' },
  { value: 'priceAsc', label: '낮은가격순' },
  { value: 'priceDesc',label: '높은가격순' },
]

watch(() => props.modelValueTypes, (v) => {
  const set = new Set(v ?? [])
  if (ALL_TYPES.every(t => set.has(t))) localActive.value = 'ALL'
  else if (set.size === 1 && ALL_TYPES.includes([...set][0])) localActive.value = [...set][0]
  else localActive.value = 'ALL'
}, { immediate: true })

watch(() => props.modelValueSort, v => { localSort.value = v })

function selectTab(val) {
  localActive.value = val
  emit('update:modelValueTypes', val === 'ALL' ? [...ALL_TYPES] : [val])
}
function emitSort() {
  emit('update:modelValueSort', localSort.value)
}
</script>

<style scoped>
.filter-bar{
  --h: 36px;
  --tab-padding-x: 12px;
  --tab-gap: 6px;
  --radius: 999px;
  --bar-gap: 10px;
  --max-w: 393px;

  width: 100%;
  max-width: var(--max-w);
  margin: 0 auto 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bar-gap);
  flex-wrap: nowrap;
  min-width: 0;
}

.tabs{
  flex: 1 1 auto;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--tab-gap);
  background: #fff;
  border: 1px solid var(--color-light);
  border-radius: var(--radius);
  padding: 4px 6px; 
  height: var(--h);
  box-sizing: border-box;
  overflow: hidden; 
}

.tab{
  background: transparent;
  border: none;
  color: var(--color-primary);
  border-radius: var(--radius);
  padding: 0 var(--tab-padding-x);
  height: calc(var(--h) - 8px);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;
  transition: background .15s ease, color .15s ease, box-shadow .15s ease;
  min-width: 40px;
}
.tab.active{
  background: var(--color-primary);
  color: #fff;
}

.sort-host{ flex: 0 0 auto; }
.sort-host :deep(select){
  height: var(--h);                 /* 세그먼트와 정확히 동일 */
  border-radius: 24px;
  border: 1px solid var(--color-light);
  background-color: #fff;
  color: var(--color-primary);
  padding: 0 32px 0 14px;
  box-sizing: border-box;
}

@media (max-width: 360px){
  .filter-bar{ --h: 34px; --tab-padding-x: 10px; --tab-gap: 4px; --bar-gap: 8px; }
  .tab{ min-width: 52px; }
}
</style>