import express from 'express';
import {
  createNewTodo,
  deleteTodo,
  getMyTodos,
  updateTodo,
} from '../controllers/todoController.js';
const __dirname = import.meta.dirname;
const router = express.Router();

router
  .route('/')
  .get(getMyTodos)
  .post(createNewTodo)
  .patch(updateTodo)
  .delete(deleteTodo);

export default router;
