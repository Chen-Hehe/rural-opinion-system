<template>
  <header class="site-header">
    <div class="container">
      <h1 class="site-title">乡村意见簿</h1>
      <nav class="site-nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link v-if="isLoggedIn" to="/publish" class="nav-link">发布意见</router-link>
        <router-link v-if="!isLoggedIn" to="/login" class="nav-link">登录</router-link>
        
        <template v-if="isLoggedIn">
          <span class="welcome-text">
            欢迎您:{{ userName }}【{{ userRoleText }}】
          </span>
          <a href="#" class="nav-link" @click.prevent="handleLogout">退出</a>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(() => Boolean(userStore.token))
const userName = computed(() => userStore.userInfo?.name || userStore.userInfo?.username || '用户')
const userRoleText = computed(() => {
  const role = userStore.userInfo?.role
  return role === 'official' ? '村干部' : '村民'
})

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.site-header {
  background-color: #4CAF50;
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.site-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.site-nav {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #f0f0f0;
}

.welcome-text {
  color: white;
  font-size: 16px;
}

.welcome-text a {
  color: white;
  text-decoration: underline;
  margin-left: 8px;
}

.welcome-text a:hover {
  color: #f0f0f0;
}
</style>
