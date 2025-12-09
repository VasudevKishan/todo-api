import { request, response, RequestHandler } from 'express';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Todo, { TodoType } from '../models/Todo.js';

interface getMyTodosReqBody {
  userId: string;
}
interface getMyProjectsResBody {
  todos: TodoType[];
}
type FilterBy = 'project' | 'starred';
// const allowedFilters = ['starred', 'project'];
interface getMyProjectsQueryParams {
  filterBy: FilterBy;
  value: string;
}
// @desc Get all my todos
// @desc GET /mytodos
// access Private
const getMyTodos: RequestHandler<
  Record<string, never>, // no params
  getMyProjectsResBody | { message: string }, // response body
  getMyTodosReqBody, // no request body
  getMyProjectsQueryParams // no query params
> = async (req, res) => {
  const { userId } = req.body;
  const { filterBy, value } = req.query;

  if (!userId)
    return res.status(400).json({ message: 'All fields are required' });
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  let query = Todo.find().where('userId').equals(userId);

  if (filterBy && value) {
    switch (filterBy) {
      case 'project':
        query = query.where('projectId').equals(value);
        break;
      case 'starred':
        if (value !== 'true' && value !== 'false') {
          return res.status(400).json({ message: 'Invalid query params' });
        }
        query = query.where('starred').equals(value === 'true');
        break;
      default:
        return res.status(400).json({ message: 'Invalid query params' });
    }
  }

  const todos = await query.lean().exec();

  if (todos.length == 0)
    return res.status(400).json({ message: 'No todos found!' });

  return res.json({ todos: todos });
};

// -----------------------------------------------------------------------------

type createNewTodoResType = { message: string };
interface createNewTodoReqType {
  title: string;
  description: string;
  starred: boolean;
  dueAt?: string;
  userId: string;
  projectId: string;
}
// @desc Create new Todo
// @desc POST /mytodos
// access Private
const createNewTodo: RequestHandler<
  Record<string, never>,
  createNewTodoResType,
  createNewTodoReqType,
  Record<string, never>
> = async (req, res) => {
  const { userId, projectId, title, description, starred, dueAt } = req.body;
  // console.log(req.body);

  if (
    !userId ||
    !projectId ||
    !title ||
    !description ||
    typeof starred !== 'boolean'
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findById(userId).select('-password').lean().exec();

  const project = await Project.findById(projectId)
    .where('userId')
    .equals(userId)
    .lean()
    .exec();

  if (!user) {
    return res.status(400).json({ message: 'Invalid User ID' });
  }
  if (!project) {
    return res.status(400).json({ message: 'Invalid Project ID' });
  }

  let parsedDate: Date | undefined = undefined;
  let newTodoObj: Object = {
    title,
    description,
    starred,
    completed: false,
    projectId,
    userId,
  };
  if (dueAt) {
    parsedDate = new Date(dueAt);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    newTodoObj = {
      ...newTodoObj,
      dueAt: parsedDate,
    };
  }

  const createdTodo = await Todo.create(newTodoObj);

  if (createdTodo)
    res
      .status(201)
      .json({ message: `New Todo with ID: ${createdTodo._id} created!` });
  else res.status(500).json({ message: 'Unable to create TODO' });
};

// -----------------------------------------------------------------------------

interface UpdateTodoReqType {
  todoId: string;
  title?: string;
  description?: string;
  starred?: boolean;
  dueAt?: string;
  // userId?: string;
  projectId?: string;
  completed?: boolean;
}

type UpdateTodoResType = { message: string };
// interface UpdateTodoReqParams {
//   todoId: string;
// }
// @desc update Todo
// @desc patch /mytodos
// access Private
const updateTodo: RequestHandler<
  Record<string, never>,
  UpdateTodoResType,
  UpdateTodoReqType,
  Record<string, never>
> = async (req, res) => {
  // const { todoId } = req.params;
  // console.log('todo id:' + todoId);
  const { todoId, title, description, starred, dueAt, projectId, completed } =
    req.body;

  if (!todoId)
    return res.status(400).json({ message: 'Todo Id required to update!' });

  const todo = await Todo.findById(todoId);
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (starred !== undefined) todo.starred = starred;
  if (dueAt !== undefined) {
    const parsedDate = new Date(dueAt);
    todo.dueAt = parsedDate;
  }

  if (projectId !== undefined) {
    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ message: `Project with ID ${projectId} not found` });

    todo.projectId = project._id;
  }
  if (completed !== undefined) todo.completed = completed;

  const updatedTodo = await todo.save();

  res.json({
    message: `Todo with Id ${updatedTodo._id} updated`,
  });
};

// -----------------------------------------------------------------------------

type deleteTodoResType = { message: string };

interface deleteTodoReqType {
  todoId: string;
}

// @desc Delete Todo
// @desc DELETE /mytodos
// access Private
const deleteTodo: RequestHandler<
  Record<string, never>,
  deleteTodoResType,
  deleteTodoReqType,
  Record<string, never>
> = async (req, res) => {
  const { todoId } = req.body;
  if (!todoId) return res.status(400).json({ message: 'Todo ID required' });

  const todo = await Todo.findById(todoId).exec();

  if (!todo)
    return res
      .status(404)
      .json({ message: `Todo with ID ${todoId} not found` });

  const deletedTodo = await Todo.findByIdAndDelete(todoId);

  if (!deletedTodo) {
    return res.status(500).json({ message: 'Error in deleting the TODO' });
  }
  res.json({
    message: `Todo ${deletedTodo.title} with ID ${deletedTodo._id} deleted`,
  });
};

export { getMyTodos, createNewTodo, updateTodo, deleteTodo };
