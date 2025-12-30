import { Project, Status } from "@/schemas/project.schema";

export interface ProjectStore {
  projects: Project[];

  addProject: (title: string, description?: string, status?: Status) => void;
  addTask: (projectId: string, title: string, description?: string, status?: Status) => void;
  addSubtask: (
    projectId: string,
    taskId: string,
    title: string,
    description?: string,
    status?: Status
  ) => void;

  updateProjectTitle: (projectId: string, title: string) => void;
  updateProjectDescription: (projectId: string, description: string) => void;
  updateTaskTitle: (projectId: string, taskId: string, title: string) => void;
  updateTaskDescription: (projectId: string, taskId: string, description: string) => void;
  updateSubtaskTitle: (projectId: string, taskId: string, subtaskId: string, title: string) => void;
  updateSubtaskDescription: (
    projectId: string,
    taskId: string,
    subtaskId: string,
    description: string
  ) => void;

  updateProjectStatus: (projectId: string, status: Status) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: Status) => void;
  updateSubtaskStatus: (
    projectId: string,
    taskId: string,
    subtaskId: string,
    status: Status
  ) => void;

  deleteProject: (projectId: string) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  deleteSubtask: (projectId: string, taskId: string, subtaskId: string) => void;
}
