<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '../utils/request'

const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  phone: '',
  address: '',
  role: 'official',
})

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!registerForm.username || !registerForm.password || !registerForm.name || !registerForm.phone || !registerForm.address) {
    errorMessage.value = '请填写所有必填字段'
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  loading.value = true

  try {
    const res = await request.post('/auth/register', {
      username: registerForm.username,
      password: registerForm.password,
      name: registerForm.name,
      phone: registerForm.phone,
      address: registerForm.address,
      role: registerForm.role,
    })
    const data = res?.data || res

    successMessage.value = data?.message || '注册成功，等待审核'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || error?.message || '注册失败'
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
      <h2 class="auth-title register-title">干部注册</h2>

      <form class="auth-form register-form" @submit.prevent="handleRegister">
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
          <label class="form-label" for="confirm-password">确认密码</label>
          <input
            id="confirm-password"
            v-model="registerForm.confirmPassword"
            class="form-input"
            type="password"
            placeholder="请再次输入密码"
          />
        </div>

        <div class="form-item">
          <label class="form-label" for="name">真实姓名</label>
          <input
            id="name"
            v-model="registerForm.name"
            class="form-input"
            type="text"
            placeholder="请输入真实姓名"
          />
        </div>

        <div class="form-item">
          <label class="form-label" for="phone">手机号码</label>
          <input
            id="phone"
            v-model="registerForm.phone"
            class="form-input"
            type="tel"
            placeholder="请输入手机号码"
          />
        </div>

        <div class="form-item">
          <label class="form-label" for="address">家庭住址</label>
          <input
            id="address"
            v-model="registerForm.address"
            class="form-input"
            type="text"
            placeholder="请输入家庭住址"
          />
        </div>

        <button class="submit-btn" type="submit" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
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
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 28px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(12, 22, 44, 0.08);
}

.auth-title {
  margin: 0 0 20px;
  text-align: center;
  color: #1f2d3d;
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
  font-weight: 500;
}

.form-input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d7dcea;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}

.form-input:focus {
  border-color: #3a7afe;
}

.submit-btn {
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #4CAF50;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background: #45a049;
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
  font-size: 14px;
}

.error-message {
  color: #f44336;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}

.success-message {
  color: #4CAF50;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}
</style>
