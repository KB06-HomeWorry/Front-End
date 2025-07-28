<template>
  <div>
    <h1>Map Component Test</h1>
    <br>
    <MarketPrice location="화양동" price="2.7억" />  
    <br>
    <FilterButton text="테스트" />  
    <br>
    <FilterBar/>
</div>
    
</template>

<script setup>
import AreaSlider from '@/pages/map/components/AreaSlider.vue'
import FilterButton from '@/pages/map/components/FilterButton.vue'
import FilterBar from '@/pages/map/components/FilterBar.vue'
</script>
