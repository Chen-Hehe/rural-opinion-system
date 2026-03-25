const { User, Opinion, Reply } = require('../models');

const getUsers = async (req, res) => {
  try {
    const status = req.query.status || 'pending';

    const users = await User.find({ role: 'villager', status }).sort({ createdAt: -1 });

    return res.status(200).json({
      list: users,
    });
  } catch (error) {
    return res.status(500).json({ message: '获取用户列表失败' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    return res.status(200).json({
      message: '审核状态更新成功',
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: '审核状态更新失败' });
  }
};

const replyOpinion = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const opinion = await Opinion.findById(id);
    if (!opinion) {
      return res.status(404).json({ message: '意见不存在' });
    }

    const reply = await Reply.create({
      opinionId: id,
      officialId: req.user._id,
      content,
    });

    opinion.isReplied = true;
    await opinion.save();

    const populatedReply = await Reply.findById(reply._id).populate('officialId', 'name role');

    return res.status(201).json({
      message: '回复成功',
      reply: populatedReply,
    });
  } catch (error) {
    return res.status(500).json({ message: '回复失败' });
  }
};

module.exports = {
  getUsers,
  updateUserStatus,
  replyOpinion,
};
