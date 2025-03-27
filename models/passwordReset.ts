import { Schema, model, models } from 'mongoose';
import mongoose from 'mongoose';

const PasswordResetSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: [true, 'Token is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expires at is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PasswordReset =
  models.PasswordReset || model('PasswordReset', PasswordResetSchema);

export default PasswordReset;
