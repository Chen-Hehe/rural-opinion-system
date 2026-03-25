<template>
  <main class="auth-page">
    <section class="login-form">
      <h2>{{ isLoginMode ? '用户登录' : '用户注册' }}</h2>

      <form v-if="isLoginMode" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-username">用户名</label>
          <input id="login-username" v-model.trim="loginForm.username" type="text" required />
        </div>

        <div class="form-group">
          <label for="login-password">密码</label>
          <input id="login-password" v-model="loginForm.password" type="password" required />
        </div>

        <div class="form-group">
          <label for="login-user-type">用户类型</label>
          <select id="login-user-type" v-model="loginForm.role" required>
            <option value="villager">村民</option>
            <option value="official">村干部</option>
          </select>
        </div>

        <div class="form-actions">
          <button id="submit-login" type="submit" :disabled="submitting">
            {{ submitting ? '登录中...' : '登录' }}
          </button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <p class="register-link">
          还没有账号？
          <a href="#" @click.prevent="switchMode(false)">立即注册</a>
        </p>
      </form>

      <form v-else @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="register-username">用户名</label>
          <input id="register-username" v-model.trim="registerForm.username" type="text" required />
        </div>

        <div class="form-group">
          <label for="register-password">密码</label>
          <input id="register-password" v-model="registerForm.password" type="password" required />
        </div>

        <div class="form-group">
          <label for="register-confirm-password">确认密码</label>
          <input
            id="register-confirm-password"
            v-model="registerForm.confirmPassword"
            type="password"
            required
          />
        </div>

        <div class="form-group">
          <label for="register-name">真实姓名</label>
          <input id="register-name" v-model.trim="registerForm.name" type="text" required />
        </div>

        <div class="form-group">
          <label for="register-phone">手机号码</label>
          <input id="register-phone" v-model.trim="registerForm.phone" type="tel" required />
        </div>

        <div class="form-group">
          <label for="register-address">家庭住址</label>
          <input id="register-address" v-model.trim="registerForm.address" type="text" required />
        </div>

        <div class="form-group">
          <label for="register-user-type">用户类型</label>
          <select id="register-user-type" v-model="registerForm.role" required>
            <option value="villager">村民</option>
            <option value="official">村干部</option>
          </select>
        </div>

        <div class="form-actions">
          <a href="#" class="cancel-btn" @click.prevent="switchMode(true)">去登录</a>
          <button id="submit-register" type="submit" :disabled="submitting">
            {{ submitting ? '提交中...' : '注册' }}
          </button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const isLoginMode = ref(true)
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  role: 'villager',
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  phone: '',
  address: '',
  role: 'villager',
})

function switchMode(loginMode: boolean) {
  isLoginMode.value = loginMode
  errorMessage.value = ''
  successMessage.value = ''
}

async function handleLogin() {
  errorMessage.value = ''
  successMessage.value = ''
  submitting.value = true

  try {
    await userStore.login({
      username: loginForm.username,
      password: loginForm.password,
      role: loginForm.role,
    })
    await router.push('/')
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
    errorMessage.value = message || '登录失败，请稍后重试'
    alert(errorMessage.value)
  } finally {
    submitting.value = false
  }
}

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (registerForm.password !== registerForm.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  submitting.value = true

  try {
    const result = await userStore.register({
      username: registerForm.username,
      password: registerForm.password,
      name: registerForm.name,
      phone: registerForm.phone,
      address: registerForm.address,
      role: registerForm.role,
    })

    successMessage.value = result?.message || '注册成功'
    switchMode(true)
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
    errorMessage.value = message || '注册失败，请稍后重试'
    alert(errorMessage.value)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.auth-page {
  padding: 30px 20px;
}

.login-form {
  max-width: 420px;
  margin: 0 auto;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
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
}

.form-group input,
.form-group select {
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
}

#submit-login,
#submit-register {
  background-color: #4caf50;
  color: white;
}

#submit-login:hover,
#submit-register:hover {
  background-color: #45a049;
}

#submit-login:disabled,
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
</style>
