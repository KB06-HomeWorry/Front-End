<template>
  <div>
    <AreaSlider v-if="filterType === 'area'" />

    <!-- 거래방식이 월세일 때 -->
    <div v-if="filterType === 'rent'">
      <RangeSlider
        labelPrefix=""
        labelSuffix="만원"
        :min="0"
        :max="10000"
        @update:minValue="depositMin = $event"
        @update:maxValue="depositMax = $event"
      >
        <template #label>보증금</template>
      </RangeSlider>

      <RangeSlider
        labelPrefix=""
        labelSuffix="만원"
        :min="0"
        :max="500"
        @update:minValue="rentMin = $event"
        @update:maxValue="rentMax = $event"
      >
        <template #label>월세</template>
      </RangeSlider>
    </div>
  </div>
</template>