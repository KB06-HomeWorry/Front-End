<template>
  <div>
    <button @click="goBackToMap"><</button>

    <section>
        <div><span>건물명</span></div>
        <div><h2>가격</h2></div>
    </section>
    <section>
        <h2>실거래가</h2>
        <h3>계약일 층 거래 정보</h3>
    </section>
    <section>거래 정보</section>
    <section>매물 정보</section>
    <section>
    위치 정보
    </section>
    <KakaoMap
  v-if="lat && lng"
  :lat="lat"
  :lng="lng"
  :level="3"
  style="width: 100%; height: 300px"
>
  <KakaoMapMarker :lat="lat" :lng="lng" />
</KakaoMap>
  </div>
</template>

<script setup>
import { useRoute,useRouter } from 'vue-router';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

const router = useRouter();
const route = useRoute(); 


function goBackToMap() {
  router.push('/map');
}

import { ref, onMounted } from 'vue';

const lat = ref(null);
const lng = ref(null);
const price = ref('');

onMounted(() => {
  const latParam = parseFloat(route.query.lat);
  const lngParam = parseFloat(route.query.lng);
  if (!isNaN(latParam) && !isNaN(lngParam)) {
    lat.value = latParam;
    lng.value = lngParam;
    price.value = route.query.price;
  } else {
    console.warn('❌ 좌표 정보가 유효하지 않습니다.');
  }
});

</script>
