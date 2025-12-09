import mongoose, { Types } from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'User',
  },
});

export type ProjectType = mongoose.InferSchemaType<typeof projectSchema> & {
  _id: Types.ObjectId;
};

export default mongoose.model('Project', projectSchema);
