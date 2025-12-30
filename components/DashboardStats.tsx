"use client";

import { useProjectStore } from "@/store/project-store";

export default function DashboardStats() {
  const { projects } = useProjectStore();

  const total = projects.length;
  const pending = projects.filter((p) => p.status === "pending").length;
  const inProgress = projects.filter((p) => p.status === "in-progress").length;
  const completed = projects.filter((p) => p.status === "completed").length;

  const stats = [
    { label: "Total Projects", value: total },
    { label: "Pending", value: pending, color: "text-yellow-600" },
    { label: "In Progress", value: inProgress, color: "text-blue-600" },
    { label: "Completed", value: completed, color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className={`text-2xl font-semibold ${stat.color ?? ""}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
