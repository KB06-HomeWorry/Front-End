<template>
  <div class="overlay-card" @click.stop>
    <div class="header-row">
      <div class="title bodyMedium12px">{{ agency.officeName }}</div>
      <button class="close" @click="$emit('close')" aria-label="닫기">×</button>
    </div>

    <div class="content bodyLight10px">
      <div class="line name">{{ agency.agentName }}</div>
      <div class="line addr">{{ agency.address }}</div>
      <a
        v-if="agency.phone"
        class="phone"
        :href="dialHref"
        :target="isDial ? undefined : '_blank'"
        rel="noopener"
      >
        {{ agency.phone }}
      </a>
    </div>

    <div class="actions">
      <button class="btn-detail bodyMedium10px" @click="goDetail">상세보기</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  agency: { type: Object, required: true }
});
defineEmits(['close']);

const router = useRouter();

const isDial = computed(() => /^[\d\-\+\(\) ]+$/.test(props.agency?.phone || ''));
const dialHref = computed(() =>
  isDial.value
    ? `tel:${(props.agency.phone || '').replaceAll(' ', '')}`
    : 'https://www.kakaocorp.com/main'
);

function goDetail() {
  const id = props.agency?.officeId ?? props.agency?.id;
  if (id == null) return;
  router.push(`/agency/${id}`);
}
</script>

<style scoped>
.overlay-card {
  position: relative;
  width: 200px;
  height: 110px;
  padding: 10px;
  background: #fff;
  border: 1px solid #e5e5ec;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,.12);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 제목 왼쪽, 닫기버튼 오른쪽 */
  gap: 6px;
}

.title {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 3px;
}

.close {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--color-primary);
  font-size: 14px;
  line-height: 1;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  color: var(--color-black);
  margin-bottom: 4px;
}

.line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.btn-detail {
  height: 18px;
  width: 50px;
  line-height: 18px;
  border-radius: 12px;
  background: var(--color-primary);
  color: #fff;
  cursor: pointer;
}
</style>
