const express = require('express');
const router = express.Router();
const {
  createReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview,
} = require('../controllers/reviewController');
const {
  authenicate,
  authorizePermission,
} = require('../middleware/authentication');

router
  .route('/')
  .get(getAllReviews)
  .post(authenicate, createReview);
router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenicate, updateReview)
  .delete(authenicate, deleteReview);

module.exports = router;
