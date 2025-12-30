import { initialProjects } from "@/data/mock";
import { ProjectStore } from "@/lib/types";
import { Status } from "@/schemas/project.schema";
import { create } from "zustand";

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: initialProjects,

  addProject: (title, description, status = "pending") =>
    set((state) => ({
      projects: [
        ...state.projects,
        {
          id: crypto.randomUUID(),
          title,
          status,
          description,
          createdAt: new Date().toISOString(),
          tasks: [],
        },
      ],
    })),

  addTask: (projectId, title, description, status = "pending") =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: [
                ...project.tasks,
                {
                  id: crypto.randomUUID(),
                  title,
                  status,
                  subtasks: [],
                  createdAt: new Date().toISOString(),
                  description,
                },
              ],
              status: "in-progress",
            }
          : project
      ),
    })),

  addSubtask: (projectId, taskId, title, description, status = "pending") =>
    set((state) => ({
      projects: state.projects.map((project) => {
        if (project.id !== projectId) return project;

        const tasks = project.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: [
                  ...task.subtasks,
                  {
                    id: crypto.randomUUID(),
                    title,
                    status,
                    createdAt: new Date().toISOString(),
                    description,
                  },
                ],
                status: "in-progress" as const,
              }
            : task
        );

        return { ...project, tasks, status: "in-progress" };
      }),
    })),

  updateProjectTitle: (projectId, title) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId ? { ...project, title } : project
      ),
    })),

  updateProjectDescription: (projectId, description) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId ? { ...project, description } : project
      ),
    })),

  updateTaskTitle: (projectId, taskId, title) =>
    set((state) => ({
      projects: state.projects.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, title } : task)),
        };
      }),
    })),

  updateTaskDescription: (projectId, taskId, description) =>
    set((state) => ({
      projects: state.projects.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId ? { ...task, description } : task
          ),
        };
      }),
    })),

  updateSubtaskTitle: (projectId, taskId, subtaskId, title) =>
    set((state) => ({
      projects: state.projects.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          tasks: project.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, title } : subtask
              ),
            };
          }),
        };
      }),
    })),

  updateSubtaskDescription: (projectId, taskId, subtaskId, description) =>
    set((state) => ({
      projects: state.projects.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          tasks: project.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, description } : subtask
              ),
            };
          }),
        };
      }),
    })),

  updateProjectStatus: (projectId, status) =>
    set((state) => ({
      projects: state.projects.map((p) => {
        return p.id === projectId
          ? {
              ...p,
              status,
              tasks: p.tasks.map((t) => ({
                ...t,
                status:
                  status === "completed"
                    ? "completed"
                    : p.status === "completed"
                    ? "pending"
                    : t.status,
                subtasks: t.subtasks.map((s) => ({
                  ...s,
                  status:
                    status === "completed"
                      ? "completed"
                      : p.status === "completed"
                      ? "pending"
                      : s.status,
                })),
              })),
            }
          : p;
      }),
    })),

  updateTaskStatus: (projectId, taskId, status) =>
    set((state) => ({
      projects: state.projects.map((project) => {
        if (project.id !== projectId) return project;

        const tasks = project.tasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        );

        const projectStatus = tasks.every((t) => t.status === "completed")
          ? "completed"
          : tasks.every((t) => t.status === "in-progress")
          ? "in-progress"
          : "pending";

        return { ...project, tasks, status: projectStatus };
      }),
    })),

  updateSubtaskStatus: (projectId, taskId, subtaskId, status) =>
    set((state) => ({
      projects: state.projects.map((project) => {
        if (project.id !== projectId) return project;

        const tasks = project.tasks.map((task) => {
          if (task.id !== taskId) return task;

          const subtasks = task.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, status } : subtask
          );

          const taskStatus: Status = subtasks.every((s) => s.status === "completed")
            ? "completed"
            : "in-progress";

          return { ...task, subtasks, status: taskStatus };
        });

        const projectStatus = tasks.every((t) => t.status === "completed")
          ? "completed"
          : "in-progress";

        return { ...project, tasks, status: projectStatus };
      }),
    })),

  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== projectId),
    })),

  deleteTask: (projectId, taskId) =>
    set((state) => ({
      projects: state.projects.map((project) => {
        if (project.id !== projectId) return project;

        const tasks = project.tasks.filter((task) => task.id !== taskId);

        const projectStatus =
          tasks.length === 0
            ? "pending"
            : tasks.every((t) => t.status === "completed")
            ? "completed"
            : "in-progress";

        return { ...project, tasks, status: projectStatus };
      }),
    })),

  deleteSubtask: (projectId, taskId, subtaskId) =>
    set((state) => ({
      projects: state.projects.map((project) => {
        if (project.id !== projectId) return project;

        const tasks = project.tasks.map((task) => {
          if (task.id !== taskId) return task;

          const subtasks = task.subtasks.filter((s) => s.id !== subtaskId);

          const taskStatus: Status =
            subtasks.length === 0
              ? "pending"
              : subtasks.every((s) => s.status === "completed")
              ? "completed"
              : "in-progress";

          return { ...task, subtasks, status: taskStatus };
        });

        const projectStatus =
          tasks.length === 0
            ? "pending"
            : tasks.every((t) => t.status === "completed")
            ? "completed"
            : "in-progress";

        return { ...project, tasks, status: projectStatus };
      }),
    })),
}));
