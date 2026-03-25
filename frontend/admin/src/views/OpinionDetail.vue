<template>
  <main class="container">
    <div class="detail-header">
      <button class="back-btn" @click="goBack">← 返回</button>
    </div>

    <section class="admin-panel">
      <h2>意见详情</h2>

      <div v-if="loading" class="status-box">加载中...</div>
      <div v-else-if="error" class="status-box error">{{ error }}</div>

      <template v-else-if="opinion">
        <section class="opinion-detail">
          <h3 class="opinion-title">{{ opinion.title }}</h3>

          <div class="opinion-meta">
            <span class="user">{{ opinion.author?.name || '匿名村民' }}</span>
            <span class="date">{{ formatDate(opinion.createdAt) }}</span>
            <span class="category">{{ categoryText(opinion.category) }}</span>
          </div>

          <div class="opinion-content">
            <p>{{ opinion.content }}</p>
          </div>

          <div class="opinion-stats">
            <span>👍 {{ opinion.likes?.length || 0 }} 点赞</span>
            <span :class="['status', opinion.isReplied ? 'replied' : 'pending']">
              {{ opinion.isReplied ? '已回复' : '未回复' }}
            </span>
          </div>

          <div class="official-reply-section">
            <h4>村干部回复</h4>

            <div v-if="replies.length === 0" class="empty-text">暂无回复</div>

            <div v-for="reply in replies" :key="reply._id" class="reply-item">
              <div class="reply-header">
                <span class="user">{{ reply.officialId?.name || '村干部' }}</span>
                <span class="date">{{ formatDate(reply.createdAt) }}</span>
              </div>
              <div class="reply-content">{{ reply.content }}</div>
            </div>
          </div>

          <div class="comments-section">
            <h4>村民评论 ({{ comments.length }})</h4>

            <div v-if="comments.length === 0" class="empty-text">暂无评论</div>

            <div v-for="item in comments" :key="item._id" class="comment-item">
              <div class="comment-header">
                <span class="user">{{ item.author?.name || '村民' }}</span>
                <span class="date">{{ formatDate(item.createdAt) }}</span>
              </div>
              <div class="comment-content">{{ item.content }}</div>
            </div>
          </div>
        </section>
      </template>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')

const opinion = ref(null)
const comments = ref([])
const replies = ref([])

const categoryMap = {
  environment: '环境',
  education: '教育',
  health: '医疗',
  transportation: '交通',
  other: '其他',
}

const categoryText = (value) => categoryMap[value] || '其他'

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN')
}

const goBack = () => {
  router.back()
}

const fetchDetail = async () => {
  const id = route.params.id

  if (!id) {
    error.value = '缺少意见 ID'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const data = await request.get(`/opinions/${id}`)
    opinion.value = data.opinion || null
    comments.value = data.comments || []
    replies.value = data.replies || []
  } catch (err) {
    error.value = '获取意见详情失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.container {
  padding: 24px;
}

.detail-header {
  margin-bottom: 16px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #d7dcea;
  border-radius: 6px;
  background: #fff;
  color: #57627a;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: #3a7afe;
  color: #3a7afe;
}

.admin-panel {
  max-width: 960px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

h2 {
  margin: 0 0 20px;
  color: #1f2d3d;
}

h3,
h4 {
  margin: 0 0 12px;
  color: #1f2d3d;
}

.opinion-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.opinion-title {
  font-size: 20px;
  color: #1f2d3d;
}

.opinion-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #667085;
  font-size: 14px;
}

.category {
  background: #eef4ff;
  color: #2457d6;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.opinion-content {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  line-height: 1.8;
  color: #344054;
}

.opinion-content p {
  margin: 0;
  white-space: pre-wrap;
}

.opinion-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #667085;
  font-size: 14px;
}

.status {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.status.replied {
  background: #e8f8ee;
  color: #0c8b4f;
}

.status.pending {
  background: #fff6e5;
  color: #b26b00;
}

.official-reply-section,
.comments-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e8f0;
}

.reply-item,
.comment-item {
  border: 1px solid #e4e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
}

.reply-header,
.comment-header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: #667085;
  font-size: 13px;
  margin-bottom: 8px;
}

.reply-content,
.comment-content {
  line-height: 1.7;
  color: #344054;
  white-space: pre-wrap;
}

.empty-text {
  color: #888;
  font-size: 14px;
  text-align: center;
  padding: 20px;
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
