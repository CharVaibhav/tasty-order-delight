import mongoose from 'mongoose';

const cartOperationSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  operationType: {
    type: String,
    enum: ['ADD', 'REMOVE'],
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  productDetails: {
    name: String,
    price: Number,
    category: String,
  },
});

export const CartOperation = mongoose.model('CartOperation', cartOperationSchema); 