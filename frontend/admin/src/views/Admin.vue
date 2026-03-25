<template>
  <main class="container">
    <section class="admin-panel">
      <h2>注册审核管理</h2>

      <div v-if="loading" class="status-box">加载中...</div>
      <div v-else-if="error" class="status-box error">{{ error }}</div>

      <div v-else-if="users.length === 0" class="status-box">暂无待审核用户</div>

      <div v-else class="registration-list">
        <div v-for="user in users" :key="user._id" class="registration-item">
          <div class="registration-header">
            <h3>{{ user.name }}</h3>
            <span class="status pending">待审核</span>
          </div>
          <div class="registration-details">
            <p><strong>用户名：</strong>{{ user.username }}</p>
            <p><strong>手机号码：</strong>{{ user.phone }}</p>
            <p><strong>家庭住址：</strong>{{ user.address }}</p>
            <p><strong>注册时间：</strong>{{ formatDate(user.createdAt) }}</p>
          </div>
          <div class="registration-actions">
            <button class="approve-btn" type="button" :disabled="operating" @click="handleApprove(user._id)">
              通过
            </button>
            <button class="reject-btn" type="button" :disabled="operating" @click="handleReject(user._id)">
              拒绝
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const loading = ref(false)
const error = ref('')
const operating = ref(false)
const users = ref([])

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN')
}

const fetchUsers = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = await request.get('/admin/users', { params: { status: 'pending' } })
    users.value = data.list || []
  } catch (err) {
    error.value = '获取用户列表失败'
    users.value = []
  } finally {
    loading.value = false
  }
}

const updateUserStatus = async (userId, status) => {
  operating.value = true
  try {
    await request.put(`/admin/users/${userId}/status`, { status })
    await fetchUsers()
  } catch (err) {
    alert(err?.response?.data?.message || '操作失败')
  } finally {
    operating.value = false
  }
}

const handleApprove = (userId) => {
  updateUserStatus(userId, 'approved')
}

const handleReject = (userId) => {
  updateUserStatus(userId, 'rejected')
}

onMounted(() => {
  fetchUsers()
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

.registration-list {
  display: grid;
  gap: 16px;
}

.registration-item {
  border: 1px solid #e4e8f0;
  border-radius: 10px;
  padding: 16px;
}

.registration-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.registration-header h3 {
  margin: 0;
}

.registration-details p {
  margin: 6px 0;
  color: #344054;
}

.status {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status.pending {
  background: #fff6e5;
  color: #b26b00;
}

.registration-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.registration-actions button {
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  color: #fff;
  cursor: pointer;
}

.registration-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.approve-btn {
  background: #18a058;
}

.approve-btn:hover:not(:disabled) {
  background: #148a4a;
}

.reject-btn {
  background: #d03050;
}

.reject-btn:hover:not(:disabled) {
  background: #b02844;
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
