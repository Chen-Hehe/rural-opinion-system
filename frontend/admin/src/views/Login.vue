<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '../utils/request'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
})

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    window.alert('请输入用户名和密码')
    return
  }

  loading.value = true

  try {
    const res = await request.post('/auth/login', loginForm)
    const data = res?.data || res
    const token = data?.token || data?.data?.token
    const user = data?.user || data?.data?.user

    if (!token || !user) {
      window.alert(data?.message || '登录失败')
      return
    }

    userStore.setToken(token)
    userStore.setUserInfo(user)

    const userType = user?.userType || user?.role || data?.userType

    if (userType === 'villager' || userType === '村民') {
      router.push('/')
      return
    }

    if (userType === 'cadre' || userType === '干部') {
      window.alert('请前往干部端登录')
      return
    }

    router.push('/')
  } catch (error: any) {
    window.alert(error?.response?.data?.message || error?.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const goRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="auth-page login-page">
    <div class="auth-card login-card">
      <h2 class="auth-title login-title">登录</h2>

      <form class="auth-form login-form" @submit.prevent="handleLogin">
        <div class="form-item">
          <label class="form-label" for="username">用户名</label>
          <input
            id="username"
            v-model="loginForm.username"
            class="form-input"
            type="text"
            placeholder="请输入用户名"
          />
        </div>

        <div class="form-item">
          <label class="form-label" for="password">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            class="form-input"
            type="password"
            placeholder="请输入密码"
          />
        </div>

        <button class="submit-btn" type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <p class="auth-tip">
        还没有账号？
        <button class="link-btn" type="button" @click="goRegister">去注册</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f4f6fb;
}

.auth-card {
  width: 360px;
  padding: 28px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(12, 22, 44, 0.08);
}

.auth-title {
  margin: 0 0 20px;
  text-align: center;
}

.auth-form {
  display: grid;
  gap: 14px;
}

.form-item {
  display: grid;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #2a3241;
}

.form-input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d7dcea;
  border-radius: 8px;
  outline: none;
}

.form-input:focus {
  border-color: #3a7afe;
}

.submit-btn {
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #3a7afe;
  color: #fff;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-tip {
  margin: 16px 0 0;
  text-align: center;
  color: #57627a;
}

.link-btn {
  border: none;
  background: transparent;
  color: #3a7afe;
  cursor: pointer;
}
</style>
