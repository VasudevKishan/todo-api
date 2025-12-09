import mongoose, { Types } from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    starred: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueAt: {
      type: Date,
      required: false,
    },
    projectId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'Project',
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);
todoSchema.index({ user: 1, project: 1, status: 1 });

export type TodoType = mongoose.InferSchemaType<typeof todoSchema> & {
  _id: Types.ObjectId;
};

export default mongoose.model('Todo', todoSchema);
