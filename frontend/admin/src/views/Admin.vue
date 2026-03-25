<template>
  <main class="container">
    <section class="admin-panel">
      <h2>注册审核管理</h2>

      <div class="admin-nav">
        <a href="/admin" class="active">注册审核</a>
        <a href="/admin-opinions">意见管理</a>
      </div>

      <div class="registration-list">
        <div class="registration-item">
          <div class="registration-header">
            <h3>张三</h3>
            <span class="status pending">待审核</span>
          </div>
          <div class="registration-details">
            <p><strong>用户名：</strong>zhangsan</p>
            <p><strong>手机号码：</strong>13800138000</p>
            <p><strong>家庭住址：</strong>东村1组1号</p>
            <p><strong>注册时间：</strong>2026-03-18 10:00</p>
          </div>
          <div class="registration-actions">
            <button class="approve-btn" type="button">通过</button>
            <button class="reject-btn" type="button">拒绝</button>
          </div>
        </div>

        <div class="registration-item">
          <div class="registration-header">
            <h3>李四</h3>
            <span class="status pending">待审核</span>
          </div>
          <div class="registration-details">
            <p><strong>用户名：</strong>lisi</p>
            <p><strong>手机号码：</strong>13900139000</p>
            <p><strong>家庭住址：</strong>西村2组3号</p>
            <p><strong>注册时间：</strong>2026-03-18 09:30</p>
          </div>
          <div class="registration-actions">
            <button class="approve-btn" type="button">通过</button>
            <button class="reject-btn" type="button">拒绝</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

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

.approve-btn {
  background: #18a058;
}

.reject-btn {
  background: #d03050;
}
</style>
