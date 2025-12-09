import { request, response, RequestHandler } from 'express';
import Project, { ProjectType } from '../models/Project.js';
import User from '../models/User.js';
import Todo from '../models/Todo.js';

interface getMyProjectsResBody {
  projects: ProjectType[];
}
type getMyProjectsRes = getMyProjectsResBody | { message: string };
interface getMyProjectsReqBody {
  userId: string;
}
// @desc Get projects of a user
// @desc GET /myprojects
// access Private
const getMyProjects: RequestHandler<
  Record<string, never>,
  getMyProjectsRes,
  getMyProjectsReqBody,
  Record<string, never>
> = async (req, res) => {
  const { userId } = req.body;
  if (!userId)
    return res.status(400).json({ message: 'All fields are required' });

  // TODO: check if user exists

  // const user = await User.findById(userId).exec();
  // if (!user)
  //   return res
  //     .status(400)
  //     .json({ message: `User with ID ${userId} does not exist!` });

  const myProjects = await Project.find()
    .where('userId')
    .equals(userId)
    .lean()
    .exec();

  if (!myProjects)
    return res.status(400).json({ message: 'No Projects found!' });

  // const formattedProjects = myProjects.map((p) => ({
  //   _id: p._id,
  //   projectName: p.projectName,
  //   userId: p.userId,
  // }));

  res.json({ projects: myProjects });
};

// -----------------------------------------------------------------------------

type createNewProjectRes = { message: string };
interface createNewProjectReqBody {
  projectName: string;
  userId: string;
}
// @desc create new project for a user
// @desc POST /myprojects
// access Private
const createNewProject: RequestHandler<
  Record<string, never>,
  createNewProjectRes,
  createNewProjectReqBody,
  Record<string, never>
> = async (req, res) => {
  const { projectName, userId } = req.body;

  if (!projectName || !userId)
    return res.status(400).json({ message: 'All fields are required!' });

  const duplicate = await Project.findOne({ projectName })
    .where('userId')
    .equals(userId)
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate Project Name' });
  }

  const newProjectObj = {
    projectName,
    userId,
  };

  const newProject = await Project.create(newProjectObj);

  if (newProject)
    res
      .status(201)
      .json({ message: `New Project - ${projectName} is created!` });
  else res.status(400).json({ message: 'Invalid user data received.' });
};

// -----------------------------------------------------------------------------

type updateMyProjectRes = { message: string };
interface updateMyProjectReqBody {
  projectId: string;
  projectName: string;
  userId: string;
}
// @desc Update project name for a user
// @desc PATCH /myprojects
// access Private
const updateMyProject: RequestHandler<
  Record<string, never>,
  updateMyProjectRes,
  updateMyProjectReqBody,
  Record<string, never>
> = async (req, res) => {
  const { projectId, projectName, userId } = req.body;
  if (!projectId || !projectName || !userId)
    return res.status(400).json({ message: 'All fields are required!' });

  const project = await Project.findById(projectId).exec();

  if (!project) return res.status(400).json({ message: 'Project not found!' });

  const duplicate = await Project.findOne({ projectName })
    .where('userId')
    .equals(userId)
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicate)
    return res
      .status(409)
      .json({ message: `Project with name ${projectName} already exists!` });

  project.projectName = projectName;

  const updatedProject = await project.save();

  res.json({
    message: `Project name updated to ${updatedProject.projectName}`,
  });
};

// -----------------------------------------------------------------------------

type deleteMyProjectRes = { message: string };

interface deleteMyProjectReqBody {
  projectId: string;
}

// @desc Delete project for a user
// @desc DELETE /myprojects
// access Private
const deleteMyProject: RequestHandler<
  Record<string, never>,
  deleteMyProjectRes,
  deleteMyProjectReqBody,
  Record<string, never>
> = async (req, res) => {
  const { projectId } = req.body;

  if (!projectId)
    return res.status(400).json({ message: 'All fields are required!' });

  // TODO: add check for todo if exists
  const foundTodos = await Todo.find()
    .where('projectId')
    .equals(projectId)
    .exec();
  if (foundTodos.length !== 0)
    return res.status(400).json({
      message: 'Delete Todos under this project to delete the project',
    });

  const foundProject = await Project.findByIdAndDelete(projectId);

  if (!foundProject)
    return res.status(400).json({ message: 'Project not found!' });

  res.json({
    message: `Project ${foundProject.projectName} with ID ${foundProject._id} deleted`,
  });
};

export { getMyProjects, createNewProject, updateMyProject, deleteMyProject };
