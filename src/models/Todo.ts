import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    tile: {
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
    status: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
    project: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'Project',
    },
    user: {
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

export type TodoType = mongoose.InferSchemaType<typeof todoSchema>;

export default mongoose.model('Todo', todoSchema);
