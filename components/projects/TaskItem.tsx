"use client";

import { useState } from "react";
import { Task } from "@/schemas/project.schema";
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
import SubtaskItem from "./SubtaskItem";
import AddSubtaskForm from "../forms/AddSubtask";
import { Status, StatusEnum } from "@/schemas/project.schema";

export default function TaskItem({ task, projectId }: { task: Task; projectId: string }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempTitle, setTempTitle] = useState(task.title);
  const [tempDescription, setTempDescription] = useState(task.description || "");
  const [addSubtaskOpen, setAddSubtaskOpen] = useState(false);

  const { updateTaskTitle, updateTaskDescription, updateTaskStatus, deleteTask } =
    useProjectStore();

  const handleTitleSave = () => {
    if (tempTitle.trim() && tempTitle !== task.title) {
      updateTaskTitle(projectId, task.id, tempTitle);
    }
    setEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    if (tempDescription !== task.description) {
      updateTaskDescription(projectId, task.id, tempDescription);
    }
    setEditingDescription(false);
  };

  const handleStatusChange = (value: Status) => {
    updateTaskStatus(projectId, task.id, value);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(projectId, task.id);
    }
  };

  if (task.subtasks.length === 0) {
    return (
      <div className="border rounded-md p-3 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {editingTitle ? (
                <Input
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                  autoFocus
                  className="h-7 w-auto"
                />
              ) : (
                <div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setEditingTitle(true)}>
                  <span className="font-medium">{task.title}</span>
                  <Pencil
                    size={12}
                    className="opacity-0 group-hover:opacity-60 transition-opacity"
                  />
                </div>
              )}

              <Select value={task.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-28 h-7">
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

            <div className="ml-6 mt-1">
              {editingDescription ? (
                <Textarea
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  onBlur={handleDescriptionSave}
                  placeholder="Add description..."
                  className="text-sm h-16"
                  autoFocus
                />
              ) : (
                <div className="cursor-pointer group" onClick={() => setEditingDescription(true)}>
                  {task.description ? (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Click to add description...
                    </p>
                  )}
                  <Pencil
                    size={10}
                    className="opacity-0 group-hover:opacity-60 transition-opacity inline ml-1"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={addSubtaskOpen} onOpenChange={setAddSubtaskOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Add Subtask
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subtask</DialogTitle>
                </DialogHeader>
                <AddSubtaskForm
                  projectId={projectId}
                  taskId={task.id}
                  onSuccess={() => setAddSubtaskOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingTitle(true)}>
                  <Pencil size={12} className="mr-2" />
                  Edit Title
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditingDescription(true)}>
                  <Pencil size={12} className="mr-2" />
                  Edit Description
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 size={12} className="mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="border rounded-md overflow-hidden">
      <AccordionItem value={task.id} className="border-b-0">
        <div className="flex items-start justify-between p-3 hover:bg-muted/50">
          <div className="flex-1">
            <div className="flex items-center gap-2">
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
                    className="h-7 w-auto"
                  />
                ) : (
                  <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => setEditingTitle(true)}>
                    <span className="font-medium">{task.title}</span>
                    <Pencil
                      size={12}
                      className="opacity-0 group-hover:opacity-60 transition-opacity"
                    />
                  </div>
                )}

                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-28 h-7">
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

            <div className="ml-8 mt-1">
              {editingDescription ? (
                <Textarea
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  onBlur={handleDescriptionSave}
                  placeholder="Add description..."
                  className="text-sm h-16"
                  autoFocus
                />
              ) : (
                <div className="cursor-pointer group" onClick={() => setEditingDescription(true)}>
                  {task.description ? (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Click to add description...
                    </p>
                  )}
                  <Pencil
                    size={10}
                    className="opacity-0 group-hover:opacity-60 transition-opacity inline ml-1"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={addSubtaskOpen} onOpenChange={setAddSubtaskOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Add Subtask
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subtask</DialogTitle>
                </DialogHeader>
                <AddSubtaskForm
                  projectId={projectId}
                  taskId={task.id}
                  onSuccess={() => setAddSubtaskOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingTitle(true)}>
                  <Pencil size={12} className="mr-2" />
                  Edit Title
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditingDescription(true)}>
                  <Pencil size={12} className="mr-2" />
                  Edit Description
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 size={12} className="mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <AccordionContent className="px-3 pb-3">
          <div className="ml-6 space-y-2 border-l pl-4">
            {task.subtasks.map((subtask) => (
              <SubtaskItem
                key={subtask.id}
                subtask={subtask}
                projectId={projectId}
                taskId={task.id}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
