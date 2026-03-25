<template>
  <main class="container">
    <section class="admin-panel">
      <h2>意见管理</h2>

      <div class="admin-nav">
        <a href="/admin">注册审核</a>
        <a href="/admin-opinions" class="active">意见管理</a>
      </div>

      <div v-if="loading" class="status-box">加载中...</div>
      <div v-else-if="error" class="status-box error">{{ error }}</div>
      <div v-else-if="opinions.length === 0" class="status-box">暂无意见数据</div>

      <div v-else class="opinions-list">
        <div v-for="item in opinions" :key="item._id" class="opinion-item">
          <div class="opinion-header">
            <h3>
              <a :href="`/detail/${item._id}`" target="_blank">{{ item.title }}</a>
            </h3>
            <span class="user">{{ item.author?.name || '匿名村民' }}</span>
            <span class="date">{{ formatDate(item.createdAt) }}</span>
          </div>
          <div class="opinion-content">
            {{ item.content }}
          </div>
          <div class="opinion-footer">
            <span class="category">{{ categoryText(item.category) }}</span>
            <span :class="['status', item.isReplied ? 'replied' : 'pending']">
              {{ item.isReplied ? '已回复' : '未回复' }}
            </span>
            <button
              v-if="!item.isReplied"
              class="reply-btn"
              type="button"
              :disabled="operatingId === item._id"
              @click="goReply(item._id)"
            >
              回复
            </button>
            <a
              v-else
              :href="`/detail/${item._id}`"
              target="_blank"
              class="reply-btn view-reply-btn"
            >
              查看回复
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const operatingId = ref(null)
const opinions = ref([])

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

const fetchOpinions = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = await request.get('/opinions', { params: { limit: 50 } })
    opinions.value = data.list || []
  } catch (err) {
    error.value = '获取意见列表失败'
    opinions.value = []
  } finally {
    loading.value = false
  }
}

const goReply = (id) => {
  router.push(`/reply/${id}`)
}

onMounted(() => {
  fetchOpinions()
})
</script>

<style scoped>
.container {
  padding: 24px;
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
  margin: 0 0 16px;
  color: #1f2d3d;
}

.admin-nav {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.admin-nav a {
  color: #57627a;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  background: #f2f4f8;
}

.admin-nav a.active {
  background: #3a7afe;
  color: #fff;
}

.opinions-list {
  display: grid;
  gap: 16px;
}

.opinion-item {
  border: 1px solid #e4e8f0;
  border-radius: 10px;
  padding: 16px;
}

.opinion-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.opinion-header h3 {
  margin: 0;
  flex: 1;
}

.opinion-header h3 a {
  color: #1f2d3d;
  text-decoration: none;
}

.opinion-header h3 a:hover {
  text-decoration: underline;
}

.user,
.date {
  font-size: 13px;
  color: #667085;
}

.opinion-content {
  margin: 12px 0;
  line-height: 1.7;
  color: #344054;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.opinion-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category {
  background: #eef4ff;
  color: #2457d6;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status {
  padding: 2px 10px;
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

.reply-btn {
  margin-left: auto;
  border: none;
  background: #3a7afe;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-size: 13px;
  display: inline-block;
  text-align: center;
}

.view-reply-btn {
  background: #4CAF50;
}

.reply-btn:hover:not(:disabled) {
  background: #2563eb;
}

.view-reply-btn:hover {
  background: #45a049;
}

.reply-btn:disabled {
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
