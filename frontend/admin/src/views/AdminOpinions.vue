<template>
  <main class="container">
    <section class="admin-panel">
      <h2>意见管理</h2>

      <div class="admin-nav">
        <a href="/admin">注册审核</a>
        <a href="/admin-opinions" class="active">意见管理</a>
      </div>

      <div class="opinions-list">
        <div class="opinion-item">
          <div class="opinion-header">
            <h3><a href="/detail?id=1">关于改善村道照明的建议</a></h3>
            <span class="user">村民张三</span>
            <span class="date">2026-03-18</span>
          </div>
          <div class="opinion-content">
            村道照明不足，晚上出行不安全，建议增加路灯数量，改善照明条件。
          </div>
          <div class="opinion-footer">
            <span class="category">交通</span>
            <span class="status replied">已回复</span>
            <a href="/reply?id=1" class="reply-btn">回复</a>
          </div>
        </div>

        <div class="opinion-item">
          <div class="opinion-header">
            <h3><a href="/detail?id=2">希望加强农村垃圾处理</a></h3>
            <span class="user">村民李四</span>
            <span class="date">2026-03-17</span>
          </div>
          <div class="opinion-content">
            村里垃圾堆积严重，建议增加垃圾收集点，定期清理，改善居住环境。
          </div>
          <div class="opinion-footer">
            <span class="category">环境</span>
            <span class="status pending">未回复</span>
            <a href="/reply?id=2" class="reply-btn">回复</a>
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

.user,
.date {
  font-size: 13px;
  color: #667085;
}

.opinion-content {
  margin: 12px 0;
  line-height: 1.7;
  color: #344054;
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
  text-decoration: none;
  background: #3a7afe;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
}
</style>
