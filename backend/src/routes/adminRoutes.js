const express = require('express');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const {
  getUsers,
  updateUserStatus,
  replyOpinion,
} = require('../controllers/adminController');

const router = express.Router();

router.get('/users', auth, admin, getUsers);
router.put('/users/:id/status', auth, admin, updateUserStatus);
router.post('/opinions/:id/reply', auth, admin, replyOpinion);

module.exports = router;
