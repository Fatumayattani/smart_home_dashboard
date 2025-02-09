<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="dashboard-card">
    <h3 class="text-lg font-semibold mb-3">{{ title }}</h3>
    <slot></slot>
  </div>
</template>