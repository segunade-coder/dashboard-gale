"use client";

import { useState } from "react";
import { Subtask } from "@/schemas/project.schema";
import { useProjectStore } from "@/store/project-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Status, StatusEnum } from "@/schemas/project.schema";
import { Button } from "@/components/ui/button";

interface SubtaskItemProps {
  subtask: Subtask;
  projectId: string;
  taskId: string;
}

export default function SubtaskItem({ subtask, projectId, taskId }: SubtaskItemProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempTitle, setTempTitle] = useState(subtask.title);
  const [tempDescription, setTempDescription] = useState(subtask.description || "");

  const { updateSubtaskTitle, updateSubtaskDescription, updateSubtaskStatus, deleteSubtask } =
    useProjectStore();

  const handleTitleSave = () => {
    if (tempTitle.trim() && tempTitle !== subtask.title) {
      updateSubtaskTitle(projectId, taskId, subtask.id, tempTitle);
    }
    setEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    if (tempDescription !== subtask.description) {
      updateSubtaskDescription(projectId, taskId, subtask.id, tempDescription);
    }
    setEditingDescription(false);
  };

  const handleStatusChange = (value: Status) => {
    updateSubtaskStatus(projectId, taskId, subtask.id, value);
  };

  const handleDelete = () => {
    deleteSubtask(projectId, taskId, subtask.id);
  };

  return (
    <div className="flex items-center justify-between border rounded px-3 py-2 hover:bg-muted/50 group">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {editingTitle ? (
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
              autoFocus
              className="h-7 text-sm"
            />
          ) : (
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setEditingTitle(true)}>
              <span className="text-sm">{subtask.title}</span>
              <Pencil size={10} className="opacity-0 group-hover:opacity-60 transition-opacity" />
            </div>
          )}

          <Select value={subtask.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-24 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {StatusEnum.options.map((status) => (
                <SelectItem key={status} value={status} className="text-xs">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {editingDescription ? (
          <Textarea
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            onBlur={handleDescriptionSave}
            placeholder="Add description..."
            className="text-xs h-12 mt-1"
            autoFocus
          />
        ) : subtask.description ? (
          <div className="cursor-pointer group" onClick={() => setEditingDescription(true)}>
            <p className="text-xs text-muted-foreground mt-1">{subtask.description}</p>
          </div>
        ) : (
          <div className="cursor-pointer group mt-1" onClick={() => setEditingDescription(true)}>
            <p className="text-xs text-muted-foreground italic">Click to add description...</p>
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-xs">
          <DropdownMenuItem onClick={() => setEditingTitle(true)}>
            <Pencil size={10} className="mr-2" />
            Edit Title
          </DropdownMenuItem>
          {subtask.description && (
            <DropdownMenuItem onClick={() => setEditingDescription(true)}>
              <Pencil size={10} className="mr-2" />
              Edit Description
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 size={10} className="mr-2" />
            Delete Subtask
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
