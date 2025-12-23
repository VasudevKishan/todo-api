import express from 'express';
import {
  getMyProjects,
  createNewProject,
  updateMyProject,
  deleteMyProject,
} from '../controllers/projectController.js';
import { verifyJWT } from '../middleware/verifyJWT.js';

const __dirname = import.meta.dirname;
const router = express.Router();
router.use(verifyJWT);
router.route('/').get(getMyProjects).post(createNewProject);

router.route('/:projectId').patch(updateMyProject).delete(deleteMyProject);

export default router;
