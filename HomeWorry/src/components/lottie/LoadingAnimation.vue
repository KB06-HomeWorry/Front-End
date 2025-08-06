<template>
  <div ref="container" class="lottie-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import lottie from 'lottie-web';
import loadingAnimationData from '@/assets/lottie/Loading.json';

const container = ref(null);
let anim = null;

onMounted(() => {
  anim = lottie.loadAnimation({
    container: container.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
  });
});

onBeforeUnmount(() => {
  if (anim) anim.destroy();
});
</script>

<style scoped>
.lottie-container {
  width: 200px;
  height: 200px;
  margin: 100px auto;
}
</style>
