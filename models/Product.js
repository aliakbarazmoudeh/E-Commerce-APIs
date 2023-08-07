const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name must be provided'],
      trim: true,
      maxlength: [100, 'product name cant be bigger than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'price must be provided'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'description must be provided'],
      maxlength: [
        1000,
        'product description cant be bigger than 1000 characters',
      ],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, 'category must be provided'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'company must be provided'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
    },
    colors: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);



productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

productSchema.pre('remove', async function () {
  await this.model('Review').deleteMany({ prduct: this._id });
});

module.exports = mongoose.model('Product', productSchema);
