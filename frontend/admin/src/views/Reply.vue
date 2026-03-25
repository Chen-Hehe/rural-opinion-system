<script setup lang="ts">
import { ref } from 'vue'

const replyContent = ref('')

const handleSubmit = () => {
  if (!replyContent.value.trim()) {
    window.alert('请输入回复内容')
    return
  }

  window.alert('回复已提交（示例页面）')
}
</script>

<template>
  <main class="container">
    <section class="reply-form-page">
      <h2>干部回复</h2>

      <div class="opinion-preview">
        <h3>关于改善村道照明的建议</h3>
        <div class="opinion-meta">
          <span class="user">村民张三</span>
          <span class="date">2026-03-18</span>
          <span class="category">交通</span>
        </div>
        <div class="opinion-content">
          <p>
            村道照明不足，晚上出行不安全，建议增加路灯数量，改善照明条件。特别是村东头的小路，晚上几乎看不见路，老人和孩子出行很危险。希望村委会能够重视这个问题，尽快解决。
          </p>
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
          <a href="/detail?id=1" class="cancel-btn">取消</a>
          <button type="submit" class="submit-reply">提交回复</button>
        </div>
      </form>
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

.submit-reply {
  background: #3a7afe;
  color: #fff;
}
</style>
