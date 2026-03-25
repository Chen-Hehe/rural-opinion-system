<template>
  <div id="app">
    <LayoutHeader />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="site-footer">
      <div class="container">
        <p>&copy; 2026 乡村意见簿 | 共建美好农村</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import LayoutHeader from '@/components/LayoutHeader.vue'
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
  padding: 30px 0;
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
