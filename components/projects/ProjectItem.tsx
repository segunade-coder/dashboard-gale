"use client";

import { useState } from "react";
import { Project } from "@/schemas/project.schema";
import { useProjectStore } from "@/store/project-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import TaskItem from "./TaskItem";
import AddTaskForm from "../forms/AddTask";
import { Status, StatusEnum } from "@/schemas/project.schema";

export default function ProjectItem({ project }: { project: Project }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempTitle, setTempTitle] = useState(project.title);
  const [tempDescription, setTempDescription] = useState(project.description || "");
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const { updateProjectTitle, updateProjectDescription, updateProjectStatus, deleteProject } =
    useProjectStore();

  const handleTitleSave = () => {
    if (tempTitle.trim() && tempTitle !== project.title) {
      updateProjectTitle(project.id, tempTitle);
    }
    setEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    if (tempDescription !== project.description) {
      updateProjectDescription(project.id, tempDescription);
    }
    setEditingDescription(false);
  };

  const handleStatusChange = (value: Status) => {
    updateProjectStatus(project.id, value);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(project.id);
    }
  };

  return (
    <Accordion type="single" collapsible className="border rounded-lg overflow-hidden">
      <AccordionItem value={project.id} className="border-b-0">
        <div className="flex items-start justify-between p-4 hover:bg-muted/50">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <AccordionTrigger className="p-0 hover:no-underline w-auto">
                <div className="h-4 w-4 flex items-center justify-center" />
              </AccordionTrigger>

              <div className="flex items-center gap-2">
                {editingTitle ? (
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                    autoFocus
                    className="h-8 w-auto"
                  />
                ) : (
                  <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => setEditingTitle(true)}>
                    <h2 className="font-semibold text-lg">{project.title}</h2>
                    <Pencil
                      size={14}
                      className="opacity-0 group-hover:opacity-60 transition-opacity"
                    />
                  </div>
                )}

                <Select value={project.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {StatusEnum.options.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="ml-10 mt-2">
              {editingDescription ? (
                <Textarea
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  onBlur={handleDescriptionSave}
                  placeholder="Add description..."
                  className="text-sm"
                  autoFocus
                />
              ) : (
                <div className="cursor-pointer group" onClick={() => setEditingDescription(true)}>
                  {project.description ? (
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Click to add description...
                    </p>
                  )}
                  <Pencil
                    size={12}
                    className="opacity-0 group-hover:opacity-60 transition-opacity inline ml-2"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <AddTaskForm projectId={project.id} onSuccess={() => setAddTaskOpen(false)} />
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingTitle(true)}>
                  <Pencil size={14} className="mr-2" />
                  Edit Title
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditingDescription(true)}>
                  <Pencil size={14} className="mr-2" />
                  Edit Description
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 size={14} className="mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <AccordionContent className="px-4 pb-4">
          <div className="ml-6 space-y-3 border-l pl-4">
            {project.tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-3">
                No tasks yet. Add your first task!
              </p>
            ) : (
              project.tasks.map((task) => (
                <TaskItem key={task.id} task={task} projectId={project.id} />
              ))
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
