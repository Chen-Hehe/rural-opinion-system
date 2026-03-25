module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'official') {
    return next();
  }

  return res.status(403).json({ message: '无权限' });
};
