// models/Orders.ts
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      required: true,
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
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
        'confirmed',
        'in_progress',
        'processing',
        'ready',
        'completed',
        'cancelled',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'expired', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: [
        'cash',
        'credit_card',
        'debit_card',
        'bank_transfer',
        'gopay',
        'shopeepay',
        'ovo',
        'dana',
        'linkaja',
        'jenius',
        'qris',
        'bca_va',
        'bni_va',
        'bri_va',
        'mandiri_va',
        'permata_va',
        'cimb_va',
        'danamon_va',
        'other_va',
        'alfamart',
        'indomaret',
        'kioson',
        'pos_indonesia',
        'cash_on_delivery',
      ],
      default: 'cash_on_delivery',
    },
    orderType: {
      type: String,
      enum: ['dine_in', 'takeaway'],
      required: true,
    },
    specialInstructions: {
      type: String,
    },
    midtransOrderId: {
      type: String,
      unique: true,
    },
    midtransTransactionId: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    confirmedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
