"use client";

import { useProjectStore } from "@/store/project-store";
import ProjectItem from "@/components/projects/ProjectItem";
import AddProjectForm from "@/components/forms/AddProject";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DashboardStats from "@/components/DashboardStats";

export default function Home() {
  const projects = useProjectStore((state) => state.projects);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Project Dashboard</h1>
            <p className="text-muted-foreground">Manage your projects, tasks, and subtasks</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <AddProjectForm />
            </DialogContent>
          </Dialog>
        </div>
        <DashboardStats />
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No projects yet. Create your first project!</p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {projects.map((project) => (
                <AccordionItem key={project.id} value={project.id} className="border-0">
                  <ProjectItem project={project} />
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </main>
  );
}
