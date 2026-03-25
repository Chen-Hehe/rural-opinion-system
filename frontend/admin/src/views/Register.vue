<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '../utils/request'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
useUserStore()

const loading = ref(false)

const registerForm = reactive({
  username: '',
  password: '',
  name: '',
  role: 'villager',
})

const handleRegister = async () => {
  if (!registerForm.username || !registerForm.password || !registerForm.name) {
    window.alert('请完整填写注册信息')
    return
  }

  loading.value = true

  try {
    const res = await request.post('/auth/register', registerForm)
    const data = res?.data || res

    window.alert(data?.message || '注册成功，请登录')
    router.push('/login')
  } catch (error: any) {
    window.alert(error?.response?.data?.message || error?.message || '注册失败')
  } finally {
    loading.value = false
  }
}

const goLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="auth-page register-page">
    <div class="auth-card register-card">
      <h2 class="auth-title register-title">注册</h2>

      <form class="auth-form register-form" @submit.prevent="handleRegister">
        <div class="form-item">
          <label class="form-label" for="name">姓名</label>
          <input
            id="name"
            v-model="registerForm.name"
            class="form-input"
            type="text"
            placeholder="请输入姓名"
          />
        </div>

        <div class="form-item">
          <label class="form-label" for="username">用户名</label>
          <input
            id="username"
            v-model="registerForm.username"
            class="form-input"
            type="text"
            placeholder="请输入用户名"
          />
        </div>

        <div class="form-item">
          <label class="form-label" for="password">密码</label>
          <input
            id="password"
            v-model="registerForm.password"
            class="form-input"
            type="password"
            placeholder="请输入密码"
          />
        </div>

        <div class="form-item">
          <label class="form-label" for="role">用户类型</label>
          <select id="role" v-model="registerForm.role" class="form-input">
            <option value="villager">村民</option>
            <option value="cadre">干部</option>
          </select>
        </div>

        <button class="submit-btn" type="submit" :disabled="loading">
          {{ loading ? '提交中...' : '注册' }}
        </button>
      </form>

      <p class="auth-tip">
        已有账号？
        <button class="link-btn" type="button" @click="goLogin">去登录</button>
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
