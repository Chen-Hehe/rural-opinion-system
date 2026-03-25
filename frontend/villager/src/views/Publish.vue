<template>
  <main class="publish-page">
    <section class="publish-form">
      <h2>发布意见</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">标题</label>
          <input
            id="title"
            v-model.trim="form.title"
            type="text"
            placeholder="请输入意见标题"
            required
          />
        </div>

        <div class="form-group">
          <label for="category">类别</label>
          <select id="category" v-model="form.category" required>
            <option value="" disabled>请选择类别</option>
            <option value="environment">环境</option>
            <option value="education">教育</option>
            <option value="health">医疗</option>
            <option value="transportation">交通</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div class="form-group">
          <label for="content">内容</label>
          <textarea
            id="content"
            v-model="form.content"
            rows="6"
            placeholder="请详细描述你的意见或建议..."
            required
          />
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="handleCancel">取消</button>
          <button type="submit" :disabled="submitting">
            {{ submitting ? '发布中...' : '发布' }}
          </button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  title: '',
  category: '',
  content: '',
})

const handleSubmit = async () => {
  if (!userStore.token) {
    errorMessage.value = '请先登录'
    router.push('/login')
    return
  }

  errorMessage.value = ''
  successMessage.value = ''
  submitting.value = true

  try {
    await request.post('/opinions', form)
    successMessage.value = '发布成功！'
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || '发布失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.publish-page {
  padding: 30px 20px;
}

.publish-form {
  max-width: 700px;
  margin: 0 auto;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.publish-form h2 {
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

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
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

.form-actions button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

.form-actions button[type="submit"]:hover:not(:disabled) {
  background-color: #45a049;
}

.form-actions button[type="submit"]:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
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
</style>
