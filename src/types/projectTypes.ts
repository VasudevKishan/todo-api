import { ProjectType } from '../models/Project.js';

export interface getMyProjectsResBody {
  projects: ProjectType[];
}
export type getMyProjectsRes = getMyProjectsResBody | { message: string };

// -----------------------------------------------------------------------------

export type createNewProjectRes = { message: string };
export interface createNewProjectReqBody {
  projectName: string;
}

// -----------------------------------------------------------------------------

export type updateMyProjectRes = { message: string };
export interface updateMyProjectReqBody {
  projectId: string;
  projectName: string;
  userId: string;
}

// -----------------------------------------------------------------------------

export type deleteMyProjectRes = { message: string };

export interface deleteMyProjectReqBody {
  projectId: string;
}
