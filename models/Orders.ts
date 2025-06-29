// models/Orders.ts
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    orderType: {
      type: String,
      enum: ['dine_in', 'takeaway'],
      required: true,
    },
    specialInstructions: {
      type: String,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'awaiting_payment',
        'paid',
        'processing',
        'completed',
        'cancelled',
      ],
      default: 'pending',
    },
    // Payment fields
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'expired', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: [
        'credit_card',
        'bank_transfer',
        'gopay',
        'shopeepay',
        'ovo',
        'dana',
      ],
    },
    midtransOrderId: {
      type: String,
      unique: true,
    },
    midtransTransactionId: {
      type: String,
    },
    snapToken: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    confirmedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;
