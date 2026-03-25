<template>
  <main class="register-page">
    <section class="register-form">
      <h2>用户注册</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model.trim="form.username"
            type="text"
            required
            placeholder="请输入用户名"
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="请输入密码"
          />
        </div>

        <div class="form-group">
          <label for="confirm-password">确认密码</label>
          <input
            id="confirm-password"
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="请再次输入密码"
          />
        </div>

        <div class="form-group">
          <label for="name">真实姓名</label>
          <input
            id="name"
            v-model.trim="form.name"
            type="text"
            required
            placeholder="请输入真实姓名"
          />
        </div>

        <div class="form-group">
          <label for="phone">手机号码</label>
          <input
            id="phone"
            v-model.trim="form.phone"
            type="tel"
            required
            placeholder="请输入手机号码"
          />
        </div>

        <div class="form-group">
          <label for="address">家庭住址</label>
          <input
            id="address"
            v-model.trim="form.address"
            type="text"
            required
            placeholder="请输入家庭住址"
          />
        </div>

        <div class="form-actions">
          <a href="#" class="cancel-btn" @click.prevent="handleCancel">取消</a>
          <button id="submit-register" type="submit" :disabled="submitting">
            {{ submitting ? '注册中...' : '注册' }}
          </button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <p class="register-link">
          已有账号？
          <a href="#" @click.prevent="goLogin">去登录</a>
        </p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  phone: '',
  address: '',
})

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (form.password !== form.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  submitting.value = true

  try {
    await userStore.register({
      username: form.username,
      password: form.password,
      name: form.name,
      phone: form.phone,
      address: form.address,
      role: 'villager',
    })

    successMessage.value = result?.message || '注册成功，等待村干部审核'
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || '注册失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

const goLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-page {
  padding: 30px 20px;
}

.register-form {
  max-width: 420px;
  margin: 0 auto;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.register-form h2 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

#submit-register {
  background-color: #4caf50;
  color: white;
}

#submit-register:hover:not(:disabled) {
  background-color: #45a049;
}

#submit-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.success-message {
  color: #4caf50;
  margin-top: 10px;
  text-align: center;
}

.error-message {
  color: #f44336;
  margin-top: 10px;
  text-align: center;
}

.register-link {
  margin-top: 20px;
  text-align: center;
}

.register-link a {
  color: #4caf50;
  text-decoration: none;
  transition: color 0.3s;
}

.register-link a:hover {
  color: #45a049;
  text-decoration: underline;
}
</style>
