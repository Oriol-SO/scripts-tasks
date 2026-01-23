<template>
  <div class="flex flex-col min-h-screen bg-white w-full">
    <!-- Header Component -->
    <Header />

    <!-- Main Content Area -->
    <main class="flex-1 w-full bg-white" style="min-height: calc(100vh - 80px);">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
</script>

<style scoped>
/* Layout sin sidebar */
</style>
