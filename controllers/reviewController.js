const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isProductValid = await Product.findById(productId);
  if (!isProductValid) {
    throw new customError.BadRequestError('No product with this ID');
  }
  const isSubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (isSubmitted) {
    throw new customError.BadRequestError(
      'you already have a review on this product'
    );
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({ path: 'product', select: 'name company price' })
    .populate({ path: 'user', select: 'name' });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new customError.NotFoundError('No review with this ID');
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    throw new customError.NotFoundError('No review with this ID');
  }
  checkPermissions(req.user, review.user);
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new customError.NotFoundError('No review with this ID');
  }
  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: 'deleted successfuly' });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
