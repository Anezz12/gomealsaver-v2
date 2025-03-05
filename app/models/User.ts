import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Email is required'],
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },

    provider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model('User', UserSchema);

export default User;
