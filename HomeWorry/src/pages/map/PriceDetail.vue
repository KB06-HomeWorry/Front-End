<template>
  <div class="price-detail-container">
    <h2>시세 상세 정보</h2>
    <ul>
      <li><strong>가격:</strong> {{ trendprice.toLocaleString() }}원</li>
      <li><strong>위도:</strong> {{ trendlat }}</li>
      <li><strong>경도:</strong> {{ trendlng }}</li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute,useRouter } from 'vue-router'

const router=useRouter()
const route = useRoute()

const trendlat = ref(null)
const trendlng = ref(null)
const trendprice = ref('')

const priceTrendId = route.params.priceTrendId


onMounted(async () => {
  const priceid = priceTrendId
  if (!priceid) {
    console.log('priceid 없음')
    return
  }

  try {
    const endpoint2 = `/api/pricetrend/${priceid}`
    const response2 = await fetch(endpoint2)
    const data2 = await response2.json()

    trendlat.value = data2.latitude
    trendlng.value = data2.longitude
    trendprice.value = data2.price
  } catch (error) {
    console.error('데이터 가져오기 실패:', error)
  }
})
</script>

<style scoped>
.price-detail-container {
  padding: 1rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
}
</style>