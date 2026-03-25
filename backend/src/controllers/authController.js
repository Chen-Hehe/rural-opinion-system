const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
  try {
    const { username, password, name, phone, address, role, userType } = req.body;

    const targetRole = userType || role;

    const existedUser = await User.findOne({ username });
    if (existedUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    await User.create({
      username,
      password,
      name,
      phone,
      address,
      role: targetRole,
      status: 'pending',
    });

    return res.status(201).json({ message: '注册成功，等待审核' });
  } catch (error) {
    return res.status(500).json({ message: '注册失败' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password, userType } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    if (user.role !== userType) {
      return res.status(401).json({ message: '用户类型不匹配' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ message: '账号审核中' });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ message: '账号被拒绝' });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = {
      _id: user._id,
      username: user.username,
      role: user.role,
      status: user.status,
      name: user.name,
      phone: user.phone,
      address: user.address,
    };

    return res.status(200).json({
      message: '登录成功',
      token,
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ message: '登录失败' });
  }
};

module.exports = {
  register,
  login,
};
