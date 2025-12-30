import { Project } from "@/schemas/project.schema";

export const initialProjects: Project[] = [
  {
    id: "1",
    title: "Website Redesign",
    description: "Complete overhaul of company website",
    status: "in-progress",
    createdAt: "2024-01-15",
    tasks: [
      {
        id: "1-1",
        title: "Design Phase",
        status: "completed",
        createdAt: "2024-01-16",
        subtasks: [
          {
            id: "1-1-1",
            title: "Wireframes",
            status: "completed",
            createdAt: "2024-01-17",
          },
          { id: "1-1-2", title: "Mockups", status: "completed", createdAt: "2024-01-18" },
        ],
      },
    ],
  },
];
