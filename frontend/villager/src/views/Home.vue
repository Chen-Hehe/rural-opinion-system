<template>
  <main class="home-page">
    <section class="filter">
      <input
        v-model="keyword"
        type="text"
        class="search-input"
        placeholder="搜索意见标题..."
        @keyup.enter="handleSearch"
      >
      <button class="search-btn" @click="handleSearch">搜索</button>
      <select v-model="category" class="category-select" @change="handleSearch">
        <option value="">全部类别</option>
        <option value="environment">环境</option>
        <option value="education">教育</option>
        <option value="health">医疗</option>
        <option value="transportation">交通</option>
        <option value="other">其他</option>
      </select>
    </section>

    <section v-if="loading" class="status-box">加载中...</section>
    <section v-else-if="errorMsg" class="status-box error">{{ errorMsg }}</section>

    <section v-else class="opinions-list">
      <article
        v-for="item in opinions"
        :key="item._id"
        class="opinion-item"
        role="button"
        tabindex="0"
        @click="goDetail(item._id)"
        @keyup.enter="goDetail(item._id)"
      >
        <div class="opinion-header">
          <h3>
          <h3>{{ item.title }}</h3>
          </h3>
          <span class="user">{{ item.author?.name || '匿名村民' }}</span>
          <span class="date">{{ formatDate(item.createdAt) }}</span>
        </div>

        <div class="opinion-content">{{ item.content }}</div>

        <div class="opinion-footer">
          <span class="category">{{ categoryText(item.category) }}</span>
          <div class="meta">
            <span>👍 {{ item.likes?.length || 0 }}</span>
          </div>
        </div>
      </article>

      <div v-if="opinions.length === 0" class="status-box">暂无意见数据</div>
    </section>

    <section class="pagination">
      <button class="page-btn" :disabled="page <= 1 || loading" @click="changePage(page - 1)">
        上一页
      </button>

      <button
        v-for="p in totalPages"
        :key="p"
        class="page-btn"
        :class="{ active: p === page }"
        :disabled="loading"
        @click="changePage(p)"
      >
        {{ p }}
      </button>

      <button class="page-btn" :disabled="page >= totalPages || loading" @click="changePage(page + 1)">
        下一页
      </button>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

const opinions = ref([])
const loading = ref(false)
const errorMsg = ref('')

const page = ref(1)
const limit = ref(10)
const totalPages = ref(1)

const keyword = ref('')
const category = ref('')

const categoryMap = {
  environment: '环境',
  education: '教育',
  health: '医疗',
  transportation: '交通',
  other: '其他',
}

const hasFilter = computed(() => keyword.value.trim() || category.value)

const categoryText = (value) => categoryMap[value] || '其他'

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('zh-CN')
}

const goDetail = (id) => {
  router.push(`/detail/${id}`)
}

const fetchOpinions = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    const params = {
      page: page.value,
      limit: limit.value,
    }

    if (keyword.value.trim()) {
      params.keyword = keyword.value.trim()
    }

    if (category.value) {
      params.category = category.value
    }

    const data = await request.get('/opinions', { params })
    opinions.value = data.list || []
    totalPages.value = data.pagination?.totalPages || 1
  } catch (error) {
    opinions.value = []
    totalPages.value = 1
    errorMsg.value = hasFilter.value ? '搜索失败，请稍后重试' : '获取意见列表失败'
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  fetchOpinions()
}

const changePage = (targetPage) => {
  if (targetPage < 1 || targetPage > totalPages.value || targetPage === page.value) {
    return
  }

  page.value = targetPage
  fetchOpinions()
}

onMounted(() => {
  fetchOpinions()
})
</script>

<style scoped>
.home-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 20px 40px;
}

.filter {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-input {
  flex: 1;
  min-width: 220px;
  padding: 10px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
}

.search-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  background: #4caf50;
  color: #fff;
  cursor: pointer;
}

.category-select {
  padding: 10px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  min-width: 130px;
}

.opinions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.opinion-item {
  cursor: pointer;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.opinion-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.opinion-header h3 {
  margin: 0;
  font-size: 18px;
  flex: 1;
  min-width: 240px;
}

.title-link {
  color: #1f2a37;
  text-decoration: none;
}

.title-link:hover {
  color: #2d8f39;
  text-decoration: underline;
}

.user,
.date {
  color: #666;
  font-size: 14px;
}

.opinion-content {
  color: #333;
  line-height: 1.75;
  margin-bottom: 14px;
  white-space: pre-wrap;
}

.opinion-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category {
  font-size: 13px;
  color: #267f2e;
  background: #eaf7eb;
  border-radius: 999px;
  padding: 4px 10px;
}

.meta {
  color: #666;
  font-size: 14px;
}

.status-box {
  text-align: center;
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.status-box.error {
  color: #d93025;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.page-btn {
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
}

.page-btn.active {
  background: #4caf50;
  border-color: #4caf50;
  color: #fff;
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
