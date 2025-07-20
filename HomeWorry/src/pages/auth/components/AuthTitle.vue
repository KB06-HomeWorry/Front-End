<template>
    <h2 class="auth-title titleBold32px">{{ title }}</h2>
</template>

<script setup>
    const props = defineProps({ title: String })
</script>

<style scoped>
.auth-title {
    margin-top: 30px;
    margin-left: 32px;
    color: var(--color-primary);
}
</style>