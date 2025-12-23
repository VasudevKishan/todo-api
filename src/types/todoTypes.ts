import { TodoType } from '../models/Todo.js';

export interface getMyTodosResBody {
  todos: TodoType[];
}

// -----------------------------------------------------------------------------

export type createNewTodoResType = { message: string };
export interface createNewTodoReqType {
  title: string;
  description: string;
  starred: boolean;
  dueAt?: string;
  projectId: string;
}

// -----------------------------------------------------------------------------

export type updateTodoParams = { todoId: string };
export interface UpdateTodoReqType {
  title?: string;
  description?: string;
  starred?: boolean;
  dueAt?: string;
  projectId?: string;
  completed?: boolean;
}

export type UpdateTodoResType = { message: string };

// -----------------------------------------------------------------------------

export type deleteTodoResType = { message: string };

export type deleteTodoParams = { todoId: string };
