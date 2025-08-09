<template>
  <button class="info-manage-btn" @click="goToTarget">
    <img :src="iconSrc" alt="아이콘" class="btn-icon" />
    <span class="btn-text bodyMedium20px">{{ label }}</span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  label: {
    type: String,
    default: '사무소 정보 관리'
  },
  iconSrc: {
    type: String,
    required: true
  },
  routePath: {
    type: String,
    required: true
  }
})

const router = useRouter()

function goToTarget() {
  router.push(props.routePath)
}
</script>

<style scoped>
.info-manage-btn {
  display: flex;
  flex-direction: column; 
  align-items: center;
  justify-content: center;
  width: 330px;
  height: 140px;
  border: 1.5px solid var(--color-primary);
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
}

.info-manage-btn:hover {
  background: rgba(17, 31, 92, 0.1);
}

.btn-icon {
  width: 54px;
  height: 54px;
  margin-bottom: 12px;
}

.btn-text {
  color: var(--color-primary);
  text-align: center;
}
</style>
