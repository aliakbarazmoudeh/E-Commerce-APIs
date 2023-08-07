const { string } = require('joi');
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'pleas provide a rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'pleas provide a title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'pleas provide a comment'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAvrageRating = async function (productID) {
  const agg = await this.aggregate([
    {
      $match: {
        product: productID,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: '$rating',
        },
        numOfReviews: {
          $sum: 1,
        },
      },
    },
  ]);
  console.log(agg[0]);
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productID },
      {
        averageRating: agg[0]?.averageRating || 0,
        numOfReviews: agg[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAvrageRating(this.product);
});
reviewSchema.post('remove', async function () {
  await this.constructor.calculateAvrageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
