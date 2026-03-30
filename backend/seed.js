const mongoose = require('mongoose');
const User = require('./src/models/User');
const Opinion = require('./src/models/Opinion');
const Comment = require('./src/models/Comment');
const Reply = require('./src/models/Reply');

// 加载环境变量
require('dotenv').config();

// MongoDB 连接配置
const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    // 连接数据库
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 数据库连接成功');

    // 清空现有数据
    await User.deleteMany({});
    await Opinion.deleteMany({});
    await Comment.deleteMany({});
    await Reply.deleteMany({});
    console.log('🧹 已清空现有数据');

    // ========== 创建用户 ==========
    const users = await User.create([
      // 村民用户
      {
        username: 'villager_zhang',
        password: '123456',
        role: 'villager',
        status: 'approved',
        name: '张大伟',
        phone: '13812345678',
        address: '幸福村 1 组',
      },
      {
        username: 'villager_li',
        password: '123456',
        role: 'villager',
        status: 'approved',
        name: '李秀英',
        phone: '13823456789',
        address: '幸福村 2 组',
      },
      {
        username: 'villager_wang',
        password: '123456',
        role: 'villager',
        status: 'approved',
        name: '王建国',
        phone: '13834567890',
        address: '幸福村 3 组',
      },
      {
        username: 'villager_chen',
        password: '123456',
        role: 'villager',
        status: 'approved',
        name: '陈小明',
        phone: '13845678901',
        address: '幸福村 4 组',
      },
      {
        username: 'villager_liu',
        password: '123456',
        role: 'villager',
        status: 'pending',
        name: '刘芳',
        phone: '13856789012',
        address: '幸福村 5 组',
      },
      // 官员用户
      {
        username: 'official_zhao',
        password: '123456',
        role: 'official',
        status: 'approved',
        name: '赵主任',
        phone: '13900001111',
        address: '村委会',
      },
      {
        username: 'official_sun',
        password: '123456',
        role: 'official',
        status: 'approved',
        name: '孙书记',
        phone: '13900002222',
        address: '村委会',
      },
    ]);

    console.log(`👥 已创建 ${users.length} 个用户`);

    // 获取用户引用
    const villagerZhang = users.find(u => u.username === 'villager_zhang');
    const villagerLi = users.find(u => u.username === 'villager_li');
    const villagerWang = users.find(u => u.username === 'villager_wang');
    const villagerChen = users.find(u => u.username === 'villager_chen');
    const officialZhao = users.find(u => u.username === 'official_zhao');
    const officialSun = users.find(u => u.username === 'official_sun');

    // ========== 创建意见 ==========
    const opinions = await Opinion.create([
      {
        title: '村里道路需要维修',
        content: '希望村委会能尽快修复村东头的主干道，下雨天泥泞不堪，严重影响出行。特别是学生上学很不方便。',
        category: 'transportation',
        author: villagerZhang._id,
        isReplied: true,
      },
      {
        title: '建议增加垃圾分类点',
        content: '现在村里只有一个垃圾堆放点，距离较远。建议在 2 组和 3 组之间增加一个垃圾分类收集点，方便大家投放。',
        category: 'environment',
        author: villagerLi._id,
        isReplied: true,
      },
      {
        title: '村卫生室药品不全',
        content: '村卫生室经常缺药，特别是常用药如感冒药、降压药等。希望能补充药品储备，方便村民看病。',
        category: 'health',
        author: villagerWang._id,
        isReplied: false,
      },
      {
        title: '希望改善学校设施',
        content: '村里小学的教室桌椅比较老旧，体育设施也不完善。希望能争取资金改善教学条件。',
        category: 'education',
        author: villagerChen._id,
        isReplied: false,
      },
      {
        title: '申请安装路灯',
        content: '村里主要道路没有路灯，晚上出行很不安全。希望能安装太阳能路灯，照亮回家的路。',
        category: 'other',
        author: villagerZhang._id,
        isReplied: true,
      },
      {
        title: '灌溉水渠需要清淤',
        content: '春耕在即，但村里的灌溉水渠多年未清理，淤塞严重。希望能组织清淤工作，保障农业生产。',
        category: 'other',
        author: villagerLi._id,
        isReplied: false,
      },
    ]);

    console.log(`📝 已创建 ${opinions.length} 条意见`);

    // ========== 创建评论 ==========
    const comments = await Comment.create([
      {
        opinionId: opinions[0]._id,
        author: villagerLi._id,
        content: '确实，这条路太烂了，上次我的电动车都摔坏了。',
      },
      {
        opinionId: opinions[0]._id,
        author: villagerWang._id,
        content: '支持！希望能尽快解决。',
      },
      {
        opinionId: opinions[1]._id,
        author: villagerZhang._id,
        content: '好建议！我也觉得很有必要。',
      },
      {
        opinionId: opinions[2]._id,
        author: villagerChen._id,
        content: '卫生室确实经常缺药，上次想买降压药都没有。',
      },
      {
        opinionId: opinions[4]._id,
        author: villagerLi._id,
        content: '路灯真的很需要，晚上出门都要带手电筒。',
      },
      {
        opinionId: opinions[4]._id,
        author: villagerWang._id,
        content: '太阳能路灯环保又节能，支持！',
      },
    ]);

    console.log(`💬 已创建 ${comments.length} 条评论`);

    // ========== 创建官方回复 ==========
    const replies = await Reply.create([
      {
        opinionId: opinions[0]._id,
        officialId: officialZhao._id,
        content: '感谢村民的反馈。村委会已经联系了施工队，计划在下个月初开始道路维修工作。预计工期为 15 天，请大家耐心等待。',
      },
      {
        opinionId: opinions[1]._id,
        officialId: officialZhao._id,
        content: '这个建议很好！我们已经向镇上申请了垃圾分类点建设资金，预计下季度可以落实。感谢大家对环保工作的支持！',
      },
      {
        opinionId: opinions[4]._id,
        officialId: officialSun._id,
        content: '路灯安装项目已经纳入今年的民生工程计划。我们将安装 30 盏太阳能路灯，覆盖主要道路。预计 2 个月内完成安装。',
      },
    ]);

    console.log(`📢 已创建 ${replies.length} 条官方回复`);

    // ========== 添加点赞 ==========
    // 给意见 0 添加点赞
    opinions[0].likes.push(villagerLi._id, villagerWang._id);
    await opinions[0].save();

    // 给意见 1 添加点赞
    opinions[1].likes.push(villagerZhang._id, villagerWang._id, villagerChen._id);
    await opinions[1].save();

    // 给意见 4 添加点赞
    opinions[4].likes.push(villagerLi._id, villagerWang._id, villagerChen._id);
    await opinions[4].save();

    console.log('👍 已添加点赞数据');

    console.log('\n🎉 测试数据创建完成！');
    console.log('\n📊 数据统计:');
    console.log(`   - 用户：${users.length} (村民：4, 官员：2, 待审核：1)`);
    console.log(`   - 意见：${opinions.length} (已回复：3, 待回复：3)`);
    console.log(`   - 评论：${comments.length}`);
    console.log(`   - 官方回复：${replies.length}`);

  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 数据库连接已关闭');
  }
}

seed();
