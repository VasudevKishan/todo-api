import express from 'express';
import {
  createNewTodo,
  deleteTodo,
  getMyTodos,
  getTodoById,
  updateTodo,
} from '../controllers/todoController.js';
import { verifyJWT } from '../middleware/verifyJWT.js';
const __dirname = import.meta.dirname;
const router = express.Router();
router.use(verifyJWT);
router.route('/').get(getMyTodos).post(createNewTodo);
router.route('/:todoId').get(getTodoById).patch(updateTodo).delete(deleteTodo);

export default router;
