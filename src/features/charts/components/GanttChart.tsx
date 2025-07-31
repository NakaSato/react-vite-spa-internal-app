import React from "react";

interface GanttChartProps {
  projects: any[];
  onTaskUpdate?: (taskId: string, updates: any) => void;
  className?: string;
}

const GanttChart: React.FC<GanttChartProps> = ({
  projects,
  className = "",
}) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 ${className}`}
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        📊 Project Timeline (Gantt Chart)
      </h3>
      <div className="space-y-4">
        {projects.slice(0, 5).map((project, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-48 truncate text-sm font-medium text-gray-700">
              {project.name || project.projectName || `Project ${index + 1}`}
            </div>
            <div className="relative h-6 flex-1 rounded-full bg-gray-100">
              <div
                className="flex h-6 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white"
                style={{
                  width: `${Math.min(project.progress || 0, 100)}%`,
                  minWidth: project.progress > 0 ? "2rem" : "0",
                }}
              >
                {project.progress > 15 && `${project.progress || 0}%`}
              </div>
              {project.progress <= 15 && project.progress > 0 && (
                <span className="absolute left-full ml-2 text-xs font-medium text-gray-600">
                  {project.progress}%
                </span>
              )}
            </div>
            <div className="w-24 text-xs text-gray-500">
              {project.status || "Active"}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No projects to display in timeline
          </div>
        )}
      </div>
      <div className="mt-6 text-xs text-gray-400">
        * Simplified timeline view. Full Gantt chart functionality coming soon.
      </div>
    </div>
  );
};

export default GanttChart;
