import React from "react";
import { Project } from "../../shared/types/project";

interface ConstructionTabProps {
  projects: Project[];
}

const ConstructionTab: React.FC<ConstructionTabProps> = ({ projects }) => {
  const constructionProjects = projects.filter(
    (p) => p.status === "Construction"
  );

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-200 px-8 py-6">
          <h3 className="text-3xl font-bold text-gray-900">
            Active Construction Projects
          </h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {constructionProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl"
              >
                <h4 className="mb-6 text-2xl font-bold text-gray-900">
                  {project.name}
                </h4>
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-600">
                      Progress:
                    </span>
                    <span className="text-lg font-bold">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-gray-200">
                    <div
                      className="h-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-base">
                    <div>
                      <span className="font-medium text-gray-600">Client:</span>
                      <p className="font-bold text-gray-900">
                        {project.client}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        System Size:
                      </span>
                      <p className="font-bold text-gray-900">
                        {project.systemSize}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Location:
                      </span>
                      <p className="font-bold text-gray-900">
                        {project.location}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Expected Completion:
                      </span>
                      <p className="font-bold text-gray-900">
                        {new Date(
                          project.expectedCompletion
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <span className="text-base font-medium text-gray-600">
                      Assigned Teams:
                    </span>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {project.assignedTeam.map((team, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800"
                        >
                          {team}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionTab;
