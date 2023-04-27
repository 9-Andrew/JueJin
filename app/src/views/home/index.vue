<template>
  {{route.params}}
</template>
<script setup>
import {useRoute} from 'vue-router';
let route=useRoute()
</script>
<style>
  
</style>