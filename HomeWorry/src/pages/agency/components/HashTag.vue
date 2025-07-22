<template>
  <span class="hashtag-badge bodyMedium12px">
    <slot />
  </span>
</template>

<script setup>
</script>

<style scoped>
.hashtag-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 2px 10px 0 10px;
  background: #E9E9E9;
  border-radius: 12px;
  color: var(--color-primary);
  line-height: 1;
  letter-spacing: -0.03em;
}
</style>
