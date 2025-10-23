const mongoose = require('mongoose');

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

module.exports = mongoose.model('Project', projectSchema);
