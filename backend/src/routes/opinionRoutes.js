const express = require('express');
const auth = require('../middlewares/auth');
const {
  getOpinions,
  getOpinionDetail,
  createOpinion,
  toggleLikeOpinion,
  createComment,
} = require('../controllers/opinionController');

const router = express.Router();

router.get('/', getOpinions);
router.get('/:id', getOpinionDetail);
router.post('/', auth, createOpinion);
router.post('/:id/like', auth, toggleLikeOpinion);
router.post('/:id/comments', auth, createComment);

module.exports = router;
