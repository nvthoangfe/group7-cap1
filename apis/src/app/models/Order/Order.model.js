import mongoose from "mongoose";

const Schema = mongoose.Schema;
const productSchema = new Schema({
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  Image: {
    type: [String],
    required: true
  },
  ProductName: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  Quantity: {
    type: Number,
    required: true
  }
});

const orderSchema = new Schema({
  Products: [productSchema],
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  NameReceiver: {
    type: String,
    required: true
  },
  Phone: {
    type: String,
    required: true
  },
  TotalPrice: {
    type: Number,
    required: true
  },
  PaymentMethod: {
    type: Number,
    required: true
  },
  StatusPayment: {
    type: Number,
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  Vnp_TxnRef: {
    type: String,
    required: false
  },
}, {
  timestamps: true,
});

const Order = mongoose.model("orders", orderSchema);
export default Order;
