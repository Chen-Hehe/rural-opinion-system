<template>
  <div id="app">
    <AdminHeader />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="site-footer">
      <div class="container">
        <p>&copy; 2026 乡村意见簿 | 干部管理端</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AdminHeader from '@/components/AdminHeader.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.site-footer {
  background-color: #333;
  color: white;
  padding: 20px 0;
  text-align: center;
  margin-top: 50px;
}
</style>
