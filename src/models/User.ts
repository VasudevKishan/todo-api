import mongoose, { Types } from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['User', 'Admin'],
    default: ['User'],
  },
});
userSchema.virtual('isAdmin').get(function () {
  return this.roles.includes('Admin');
});

export type UserType = mongoose.InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

export default mongoose.model('User', userSchema);
