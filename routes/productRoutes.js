const express = require('express');
const router = express.Router();
const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
  getSingleProductReviews,
} = require('../controllers/productController');
const {
  authenicate,
  authorizePermission,
} = require('../middleware/authentication');

router
  .route('/')
  .get(getAllProducts)
  .post([authenicate, authorizePermission('admin')], createProduct);

router
  .route('/upload-image')
  .post([authenicate, authorizePermission('admin')], uploadImage);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenicate, authorizePermission('admin')], updateProduct)
  .delete([authenicate, authorizePermission('admin')], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;
