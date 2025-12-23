import express from 'express';
import {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { verifyJWT } from '../middleware/verifyJWT.js';

const __dirname = import.meta.dirname;
const router = express.Router();
router.use(verifyJWT);
router
  .route('/')
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);

// router.route('/:userId').patch(updateUser);

export default router;
