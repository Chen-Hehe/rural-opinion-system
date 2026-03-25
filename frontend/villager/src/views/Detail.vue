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
          <button class="like-btn" :disabled="!hasToken || liking" @click="handleLike">
            <span>👍</span>
            <span>{{ opinion.likes?.length || 0 }}</span>
            <span v-if="hasLiked" class="liked-tag">已赞</span>
          </button>
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
          <textarea
            v-model="commentContent"
            placeholder="请输入你的评论..."
            rows="3"
          />
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="commentContent = ''">取消</button>
            <button type="button" :disabled="submittingComment" @click="handleComment">
              {{ submittingComment ? '提交中...' : '发表评论' }}
            </button>
          </div>
        </div>

        <div v-else class="tip login-tip">
          <router-link to="/login">登录后可发表评论</router-link>
        </div>

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
const liking = ref(false)
const submittingComment = ref(false)

const opinion = ref(null)
const comments = ref([])
const replies = ref([])
const commentContent = ref('')

const hasToken = computed(() => Boolean(userStore.token))
const hasLiked = computed(() => {
  if (!opinion.value?.likes || !userStore.userInfo?._id) return false
  return opinion.value.likes.some(id => id === userStore.userInfo._id || id._id === userStore.userInfo._id)
})

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

const handleLike = async () => {
  if (!hasToken.value) {
    alert('请先登录')
    return
  }

  const id = route.params.id || route.query.id
  liking.value = true

  try {
    const data = await request.post(`/opinions/${id}/like`)
    if (opinion.value) {
      opinion.value.likes = data.liked 
        ? [...(opinion.value.likes || []), userStore.userInfo._id]
        : (opinion.value.likes || []).filter(id => id !== userStore.userInfo._id)
    }
  } catch (error) {
    alert(error?.response?.data?.message || '点赞失败')
  } finally {
    liking.value = false
  }
}

const handleComment = async () => {
  if (!commentContent.value.trim()) {
    alert('请输入评论内容')
    return
  }

  const id = route.params.id || route.query.id
  submittingComment.value = true

  try {
    const data = await request.post(`/opinions/${id}/comments`, {
      content: commentContent.value.trim(),
    })
    comments.value.push(data.comment)
    commentContent.value = ''
  } catch (error) {
    alert(error?.response?.data?.message || '评论失败')
  } finally {
    submittingComment.value = false
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
}

.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.like-btn:hover:not(:disabled) {
  border-color: #4caf50;
  color: #4caf50;
}

.like-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.liked-tag {
  color: #4caf50;
  font-size: 12px;
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

.comment-form {
  margin-bottom: 16px;
}

.comment-form textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.form-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.form-actions button[type="button"]:first-child {
  background: #f0f0f0;
  color: #333;
}

.form-actions button[type="button"]:first-child:hover {
  background: #e0e0e0;
}

.form-actions button[type="button"]:last-child {
  background: #4caf50;
  color: #fff;
}

.form-actions button[type="button"]:last-child:hover:not(:disabled) {
  background: #45a049;
}

.form-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tip {
  color: #666;
  font-size: 13px;
}

.login-tip a {
  color: #4caf50;
  text-decoration: none;
}

.login-tip a:hover {
  text-decoration: underline;
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
