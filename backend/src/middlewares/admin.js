const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req.user) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    const token = authHeader.slice(7);

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: '令牌无效或已过期' });
    }
  }

  if (req.user.role === 'official') {
    return next();
  }

  return res.status(403).json({ message: '无权限' });
};
