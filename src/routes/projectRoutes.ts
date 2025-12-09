import express from 'express';
import {
  getMyProjects,
  createNewProject,
  updateMyProject,
  deleteMyProject,
} from '../controllers/projectController.js';

const __dirname = import.meta.dirname;
const router = express.Router();

router
  .route('/')
  .get(getMyProjects)
  .post(createNewProject)
  .patch(updateMyProject)
  .delete(deleteMyProject);

export default router;
