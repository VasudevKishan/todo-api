import { Request, Response, RequestHandler } from 'express';
// @desc Get all users
// @desc GET /users
// access Private
const getAllUsers: RequestHandler = async (req: Request, res: Response) => {};

// @desc Create new user
// @desc POST /users
// access Private
const createNewUser: RequestHandler = async (req: Request, res: Response) => {};

// @desc update user
// @desc PATCH /users
// access Private
const updateUser: RequestHandler = async (req: Request, res: Response) => {};

// @desc delete user
// @desc DELETE /users
// access Private
const deleteUser: RequestHandler = async (req: Request, res: Response) => {};

export { createNewUser, getAllUsers, deleteUser, updateUser };
