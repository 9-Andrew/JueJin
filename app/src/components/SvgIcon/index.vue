<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>

<script setup>
defineProps({ name: { type: String, require: true } })
</script>

<style lang="less" scoped></style>