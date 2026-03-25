module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '未认证' });
  }

  if (req.user.role === 'official') {
    return next();
  }

  return res.status(403).json({ message: '无权限' });
};