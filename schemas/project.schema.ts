import { z } from "zod";

export const StatusEnum = z.enum(["pending", "in-progress", "completed"]);

export type Status = z.infer<typeof StatusEnum>;

const BaseItemSchema = {
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: StatusEnum,
  createdAt: z.string(),
};

export const SubtaskSchema = z.object({
  ...BaseItemSchema,
});

export type Subtask = z.infer<typeof SubtaskSchema>;

export const TaskSchema = z.object({
  ...BaseItemSchema,
  subtasks: z.array(SubtaskSchema),
});

export type Task = z.infer<typeof TaskSchema>;

export const ProjectSchema = z.object({
  ...BaseItemSchema,
  tasks: z.array(TaskSchema),
});

export type Project = z.infer<typeof ProjectSchema>;

export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  tasks: true,
});

export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  subtasks: true,
});

export const CreateSubtaskSchema = SubtaskSchema.omit({
  id: true,
  createdAt: true,
});
