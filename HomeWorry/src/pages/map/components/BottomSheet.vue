<template>
  <div v-if="visible" class="bs-backdrop" @click.self="close">
    <div class="bs-sheet">
      <div v-if="$slots.title" class="bs-sheet-title bodyMedium16px">
        <slot name="title" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close'])
function close() { emit('close') }
</script>

<style scoped>
.bs-backdrop {
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bs-sheet {
  width: 393px;            
  height: 400px;
  margin-bottom: 70px;   
  background: #fff;
  border-radius: 12px 12px 0 0;
  max-height: calc(80vh - 60px);
  box-sizing: border-box;
  overflow-y: auto;
  animation: showSheet 0.25s;
  padding: 16px;
}

@keyframes showSheet {
  0% { transform: translateY(100%);}
  100% { transform: translateY(0);}
}
</style>
