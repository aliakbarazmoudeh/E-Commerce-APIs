const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  createOrder,
  getCurrentUserOrders,
  updateOrder,
  getSingleOrder,
} = require('../controllers/orderController');

const {
  authenicate,
  authorizePermission,
} = require('../middleware/authentication');

router
  .route('/')
  .get([authenicate, authorizePermission('admin')], getAllOrders)
  .post(authenicate, createOrder);

router
  .route('/:id')
  .patch(authenicate, updateOrder)
  .get(authenicate, getSingleOrder);

router.route('/showAllMyOrders').get(getCurrentUserOrders);

module.exports = router;
