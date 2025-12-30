"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Status } from "@/schemas/project.schema";
import { useProjectStore } from "@/store/project-store";

interface AddSubtaskFormProps {
  projectId: string;
  taskId: string;
  onSuccess?: () => void;
}

export default function AddSubtaskForm({ projectId, taskId, onSuccess }: AddSubtaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("pending");
  const addSubtask = useProjectStore((state) => state.addSubtask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addSubtask(projectId, taskId, title, description, status);
    setTitle("");
    setDescription("");
    setStatus("pending");
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title *</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter subtask title"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter subtask description (optional)"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Initial Status</label>
        <Select value={status} onValueChange={(value: Status) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Add Subtask
      </Button>
    </form>
  );
}
