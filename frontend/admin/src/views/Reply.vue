<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const error = ref('')

const opinion = ref<any>(null)
const replyContent = ref('')

const categoryMap: Record<string, string> = {
  environment: '环境',
  education: '教育',
  health: '医疗',
  transportation: '交通',
  other: '其他',
}

const categoryText = (value: string) => categoryMap[value] || '其他'

const formatDate = (value: string) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN')
}

const fetchOpinion = async () => {
  const id = route.params.id as string
  if (!id) {
    error.value = '缺少意见 ID'
    return
  }

  loading.value = true
  try {
    const data = await request.get(`/opinions/${id}`)
    opinion.value = data.opinion || null
  } catch (err) {
    error.value = '获取意见详情失败'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!replyContent.value.trim()) {
    window.alert('请输入回复内容')
    return
  }

  const id = route.params.id as string
  submitting.value = true

  try {
    await request.post(`/admin/opinions/${id}/reply`, {
      content: replyContent.value.trim(),
    })
    window.alert('回复成功！')
    router.push('/admin-opinions')
  } catch (err: any) {
    window.alert(err?.response?.data?.message || '回复失败')
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  fetchOpinion()
})
</script>

<template>
  <main class="container">
    <section class="reply-form-page">
      <h2>干部回复</h2>

      <div v-if="loading" class="status-box">加载中...</div>
      <div v-else-if="error" class="status-box error">{{ error }}</div>

      <template v-else-if="opinion">
        <div class="opinion-preview">
          <h3>{{ opinion.title }}</h3>
          <div class="opinion-meta">
            <span class="user">{{ opinion.author?.name || '匿名村民' }}</span>
            <span class="date">{{ formatDate(opinion.createdAt) }}</span>
            <span class="category">{{ categoryText(opinion.category) }}</span>
          </div>
          <div class="opinion-content">
            <p>{{ opinion.content }}</p>
          </div>
        </div>

        <form class="reply-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="reply-content">回复内容</label>
            <textarea
              id="reply-content"
              v-model="replyContent"
              rows="8"
              required
              placeholder="请输入回复内容"
            />
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="handleCancel">取消</button>
            <button type="submit" class="submit-reply" :disabled="submitting">
              {{ submitting ? '提交中...' : '提交回复' }}
            </button>
          </div>
        </form>
      </template>
    </section>
  </main>
</template>

<style scoped>
.container {
  padding: 24px;
}

.reply-form-page {
  max-width: 960px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

h2 {
  margin: 0 0 16px;
  color: #1f2d3d;
}

.opinion-preview {
  border: 1px solid #e4e8f0;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
}

.opinion-preview h3 {
  margin: 0 0 10px;
  color: #1f2d3d;
}

.opinion-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #667085;
  font-size: 13px;
}

.category {
  padding: 2px 10px;
  border-radius: 999px;
  background: #eef4ff;
  color: #2457d6;
}

.opinion-content p {
  margin: 0;
  line-height: 1.8;
  color: #344054;
}

.reply-form {
  display: grid;
  gap: 14px;
}

.form-group {
  display: grid;
  gap: 8px;
}

.form-group label {
  color: #1f2d3d;
}

.form-group textarea {
  width: 100%;
  resize: vertical;
  min-height: 140px;
  border: 1px solid #d9dfeb;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}

.form-group textarea:focus {
  border-color: #3a7afe;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn,
.submit-reply {
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn {
  background: #f2f4f8;
  color: #57627a;
}

.cancel-btn:hover {
  background: #e5e9f2;
}

.submit-reply {
  background: #3a7afe;
  color: #fff;
}

.submit-reply:hover:not(:disabled) {
  background: #2563eb;
}

.submit-reply:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-box {
  text-align: center;
  padding: 24px;
  color: #666;
}

.status-box.error {
  color: #d93025;
}
</style>
