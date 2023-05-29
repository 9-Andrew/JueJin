<template>
  <div class="container">
    <div class="content">1</div>
    <div class="sidebar">2</div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.container {
  width: 1300px;
  margin: auto;
  display: flex;
  justify-content: space-around;
  .content {
    width: 1000px;
    background-color: #fff;
    border-radius: var(--box-radius);
  }
  .sidebar {
    width: 250px;
    background-color: #bfa;
  }
}
</style>
