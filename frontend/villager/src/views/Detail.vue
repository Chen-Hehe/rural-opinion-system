<template>
  <main class="detail-page">
    <section v-if="loading" class="status-box">详情加载中...</section>
    <section v-else-if="errorMsg" class="status-box error">{{ errorMsg }}</section>

    <template v-else-if="opinion">
      <section class="opinion-detail">
        <h2>{{ opinion.title }}</h2>

        <div class="opinion-meta">
          <span class="user">{{ opinion.author?.name || '匿名村民' }}</span>
          <span class="date">{{ formatDate(opinion.createdAt) }}</span>
          <span class="category">{{ categoryText(opinion.category) }}</span>
        </div>

        <div class="opinion-content">{{ opinion.content }}</div>

        <div class="opinion-actions">
          <span>👍 {{ opinion.likes?.length || 0 }}</span>
        </div>

        <div class="official-reply">
          <h3>村干部回复</h3>

          <div v-if="replies.length === 0" class="empty-text">暂无回复</div>

          <div v-for="reply in replies" :key="reply._id" class="reply-item">
            <div class="reply-header">
              <span class="user">{{ reply.officialId?.name || '村干部' }}</span>
              <span class="date">{{ formatDate(reply.createdAt) }}</span>
            </div>
            <div class="reply-content">{{ reply.content }}</div>
          </div>
        </div>
      </section>

      <section class="comments-section">
        <h3>评论 ({{ comments.length }})</h3>

        <div v-if="hasToken" class="comment-form">
          <textarea placeholder="请输入你的评论..." rows="3" />
          <div class="tip">已登录，可发表评论（后续可接入提交接口）。</div>
        </div>

        <div v-else class="tip login-tip">登录后可发表评论</div>

        <div class="comments-list">
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
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/utils/request'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const errorMsg = ref('')

const opinion = ref(null)
const comments = ref([])
const replies = ref([])

const hasToken = computed(() => Boolean(userStore.token))

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
  return new Date(value).toLocaleDateString('zh-CN')
}

const fetchDetail = async () => {
  const id = route.params.id || route.query.id

  if (!id) {
    errorMsg.value = '缺少意见 ID'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const data = await request.get(`/opinions/${id}`)
    opinion.value = data.opinion || null
    comments.value = data.comments || []
    replies.value = data.replies || []
  } catch (error) {
    errorMsg.value = '获取意见详情失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.detail-page {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px 20px 40px;
}

.opinion-detail,
.comments-section,
.status-box {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
}

.comments-section {
  margin-top: 16px;
}

h2,
h3 {
  margin: 0 0 12px;
}

.opinion-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.category {
  background: #eaf7eb;
  color: #267f2e;
  border-radius: 999px;
  padding: 2px 10px;
}

.opinion-content,
.reply-content,
.comment-content {
  line-height: 1.75;
  color: #333;
  white-space: pre-wrap;
}

.opinion-actions {
  margin-top: 12px;
  color: #666;
}

.official-reply {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.reply-item,
.comment-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  margin-top: 10px;
}

.reply-header,
.comment-header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.comment-form textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  resize: vertical;
}

.tip {
  color: #666;
  font-size: 13px;
  margin-top: 8px;
}

.login-tip {
  margin-bottom: 8px;
}

.empty-text {
  color: #888;
  font-size: 14px;
}

.status-box {
  text-align: center;
  color: #666;
}

.status-box.error {
  color: #d93025;
}
</style>
