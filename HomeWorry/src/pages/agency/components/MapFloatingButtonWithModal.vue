<template>
  <!-- 지도 플로팅 버튼과 지역 선택 모달 -->
  <div ref="fabWrap" class="fab-wrap">
    <button
      class="floating-btn"
      type="button"
      @click="modalOpen = true"
      aria-label="지도에서 지역검색"
    >
      <div class="fab-inner">
        <img
          src="@/assets/icons/map_floating.png"
          alt="지도 플로팅 버튼"
          class="fab-img"
        />
        <div class="fab-label bodyLight8px">중개사무소 위치</div>
      </div>
    </button>

    <!-- 모달 -->
    <div v-if="modalOpen" class="modal-overlay">
      <div class="region-modal">
        <div class="region-path bodyMedium16px">
          <template v-if="!selectedProvince">
            <span class="placeholder">지역을 선택해주세요</span>
          </template>
          <template v-else>
            <span>{{ selectedProvince }}</span>
            <span v-if="selectedCity"> &gt; {{ selectedCity }}</span>
            <span v-if="selectedDistrict"> &gt; {{ selectedDistrict }}</span>
          </template>

          <button
            class="close-btn titleBold20px"
            type="button"
            @click="closeModal"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <!-- 시/도 선택 -->
        <div v-if="!selectedProvince" class="region-list bodyMedium14px">
          <div
            v-for="province in provinceList"
            :key="province"
            class="region-item"
            @click="selectProvince(province)"
          >
            {{ province }}
          </div>
        </div>

        <!-- 시군구 선택 -->
        <div v-else-if="!selectedCity" class="region-list bodyMedium14px">
          <div
            v-for="city in cityList"
            :key="city"
            class="region-item"
            @click="selectCity(city)"
          >
            {{ city }}
          </div>
        </div>

        <!-- 동 선택 -->
        <div v-else class="region-list bodyMedium14px">
          <div
            v-for="district in districtList"
            :key="district"
            class="region-item"
            :class="{ active: selectedDistrict === district }"
            @click="selectDistrict(district)"
          >
            {{ district }}
          </div>
        </div>

        <!-- 지도 이동 -->
        <button
          class="submit-btn bodyMedium16px"
          type="button"
          :disabled="!selectedDistrict || loading"
          @click="goToMap"
        >
          <span v-if="selectedDistrict">{{ selectedDistrict }} 지도에서 보기</span>
          <span v-else>지역을 선택하세요</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import axios from 'axios'

const provinceList = ref([])
const cityList = ref([])
const districtList = ref([])

const loading = ref(false)
const modalOpen = ref(false)
const selectedProvince = ref(null)
const selectedCity = ref(null)
const selectedDistrict = ref(null)

const fabWrap = ref(null)

/* 리스트 컨테이너 우측에 고정 배치 */
function updateFabPosition() {
  const container = document.querySelector('.agency-list-page')
  if (!container || !fabWrap.value) return
  const rect = container.getBoundingClientRect()
  fabWrap.value.style.position = 'fixed'
  fabWrap.value.style.left = `${rect.right - 75}px`
  fabWrap.value.style.bottom = '120px'
  fabWrap.value.style.right = 'unset'
}

onMounted(async () => {
  await nextTick()
  updateFabPosition()
  window.addEventListener('resize', updateFabPosition)

  try {
    const res = await axios.get('http://localhost:8080/section/')
    provinceList.value = res.data
  } catch (e) {
    provinceList.value = []
    alert('시/도 데이터를 불러오지 못했습니다.')
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateFabPosition)
})

async function selectProvince(province) {
  selectedProvince.value = province
  selectedCity.value = null
  selectedDistrict.value = null
  cityList.value = []
  districtList.value = []
  loading.value = true
  try {
    const res = await axios.get(`http://localhost:8080/section/${selectedProvince.value}`)
    cityList.value = res.data
  } catch (e) {
    cityList.value = []
    alert('시/군/구 데이터를 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

async function selectCity(city) {
  selectedCity.value = city
  selectedDistrict.value = null
  districtList.value = []
  loading.value = true
  try {
    const res = await axios.get(
      `http://localhost:8080/section/${selectedProvince.value}/${selectedCity.value}`
    )
    districtList.value = res.data
  } catch (e) {
    districtList.value = []
    alert('동 데이터를 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

function selectDistrict(d) {
  selectedDistrict.value = d
}

function closeModal() {
  modalOpen.value = false
  selectedProvince.value = null
  selectedCity.value = null
  selectedDistrict.value = null
  cityList.value = []
  districtList.value = []
}

/* 좌표 조회 후 지도 페이지로 이동 */
async function goToMap() {
  if (!selectedDistrict.value || !selectedCity.value || !selectedProvince.value) return
  loading.value = true
  try {
    const res = await axios.get(
      `http://localhost:8080/section/${selectedProvince.value}/${selectedCity.value}/${selectedDistrict.value}`
    )
    const lat = res.data.y
    const lng = res.data.x
    if (lat && lng) {
      window.location.href = `/agency/map?center=${lat},${lng}&zoomLevel=3`
    } else {
      alert('위치 정보를 찾을 수 없습니다.')
    }
  } catch (e) {
    alert('지도 이동에 실패했습니다.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.floating-btn {
  position: static;
  width: 75px;
  height: 55px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(40, 70, 60, 0.14);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s;
  cursor: pointer;
  padding: 0;
}

.fab-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.fab-img {
  width: 35px;
  height: 35px;
  display: block;
}

.fab-label {
  margin-top: 2px;
  text-align: center;
  line-height: 1;
  letter-spacing: -0.03em;
  white-space: nowrap;
  font-weight: 600;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.24);
  z-index: 1001;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.region-modal {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
  width: 360px;
  margin: 64px auto 0 auto;
  padding: 24px 22px 16px 22px;
  position: relative;
}

.placeholder {
  color: var(--color-mediumgray);
}

.region-path {
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 18px;
}

.close-btn {
  margin-left: auto;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-primary);
  padding: 0 4px;
}

.region-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px 4px;
  margin-bottom: 28px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 6px;
}

.region-item {
  padding: 6px 0;
  text-align: center;
  color: var(--color-mediumgray);
  border: 1px solid var(--color-mediumgray);
  border-radius: 12px;
  cursor: pointer;
}

.region-item:hover,
.region-item.active {
  background: var(--color-primary-10);
  color: var(--color-primary);
}

.submit-btn {
  width: 100%;
  background: var(--color-primary-10);
  color: var(--color-primary);
  border: none;
  padding: 12px 0;
  border-radius: 9px;
  margin-top: 10px;
  cursor: pointer;
  transition: filter 0.13s;
}

.submit-btn:disabled {
  background: var(--color-lightgray);
  color: var(--color-darkgray);
  cursor: not-allowed;
}
</style>
