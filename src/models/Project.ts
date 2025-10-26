import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'User',
  },
});

export type ProjectType = mongoose.InferSchemaType<typeof projectSchema>;

export default mongoose.model('Project', projectSchema);
