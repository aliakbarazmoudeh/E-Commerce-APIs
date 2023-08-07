const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const Product = require('../models/Product');
const path = require('path');
const Review = require('../models/Review');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.json(product);
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({}).populate('reviews');
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new customError.NotFoundError(
      `cant find any product with this ID : ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  if (!product) {
    throw new customError.NotFoundError('cant update project with this ID');
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new customError.NotFoundError('cant delete product with this ID');
  }
  await product.remove(); 
  res.status(StatusCodes.OK).json({ msg: 'Product Removed Successfuly' });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new customError.BadRequestError('No File Uploaded');
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith('image')) {
    throw new customError.BadRequestError('Please upload an image');
  }
  if (productImage.size > 1024 * 1024) {
    throw new customError.BadRequestError(
      'size of image must be less than 1MB'
    );
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

const getSingleProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.id });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
  getSingleProductReviews,
};
