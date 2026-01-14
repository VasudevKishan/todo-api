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
// router.use(verifyJWT);
router
  .route('/')
  .get(verifyJWT, getAllUsers)
  .post(createNewUser)
  .patch(verifyJWT, updateUser)
  .delete(verifyJWT, deleteUser);

// router.route('/:userId').patch(updateUser);

export default router;
