const { Opinion, Comment, Reply } = require('../models');

const getOpinions = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.keyword) {
      filter.title = { $regex: req.query.keyword, $options: 'i' };
    }

    const [list, total] = await Promise.all([
      Opinion.find(filter)
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Opinion.countDocuments(filter),
    ]);

    return res.status(200).json({
      list,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: '获取意见列表失败' });
  }
};

const getOpinionDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const opinion = await Opinion.findById(id).populate('author', 'name');
    if (!opinion) {
      return res.status(404).json({ message: '意见不存在' });
    }

    const [comments, replies] = await Promise.all([
      Comment.find({ opinionId: id }).populate('author', 'name role').sort({ createdAt: 1 }),
      Reply.find({ opinionId: id }).populate('officialId', 'name role').sort({ createdAt: 1 }),
    ]);

    return res.status(200).json({
      opinion,
      comments,
      replies,
    });
  } catch (error) {
    return res.status(500).json({ message: '获取意见详情失败' });
  }
};

const createOpinion = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const opinion = await Opinion.create({
      title,
      content,
      category,
      author: req.user._id,
    });

    return res.status(201).json({
      message: '发布成功',
      opinion,
    });
  } catch (error) {
    return res.status(500).json({ message: '发布失败' });
  }
};

const toggleLikeOpinion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const opinion = await Opinion.findById(id);
    if (!opinion) {
      return res.status(404).json({ message: '意见不存在' });
    }

    const hasLiked = opinion.likes.some((likeUserId) => likeUserId.toString() === userId.toString());

    if (hasLiked) {
      opinion.likes = opinion.likes.filter((likeUserId) => likeUserId.toString() !== userId.toString());
    } else {
      opinion.likes.push(userId);
    }

    await opinion.save();

    return res.status(200).json({
      message: hasLiked ? '已取消点赞' : '点赞成功',
      likesCount: opinion.likes.length,
      liked: !hasLiked,
    });
  } catch (error) {
    return res.status(500).json({ message: '点赞操作失败' });
  }
};

const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const opinion = await Opinion.findById(id);
    if (!opinion) {
      return res.status(404).json({ message: '意见不存在' });
    }

    const comment = await Comment.create({
      opinionId: id,
      author: req.user._id,
      content,
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name role');

    return res.status(201).json({
      message: '评论成功',
      comment: populatedComment,
    });
  } catch (error) {
    return res.status(500).json({ message: '评论失败' });
  }
};

module.exports = {
  getOpinions,
  getOpinionDetail,
  createOpinion,
  toggleLikeOpinion,
  createComment,
};
