import React from "react";
import { Project } from "../types/project";

interface ConstructionTabProps {
  projects: Project[];
}

const ConstructionTab: React.FC<ConstructionTabProps> = ({ projects }) => {
  const constructionProjects = projects.filter(
    (p) => p.status === "Construction"
  );

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-3xl font-bold text-gray-900">
            Active Construction Projects
          </h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {constructionProjects.map((project) => (
              <div
                key={project.id}
                className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <h4 className="text-2xl font-bold text-gray-900 mb-6">
                  {project.name}
                </h4>
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <span className="text-lg text-gray-600 font-medium">
                      Progress:
                    </span>
                    <span className="text-lg font-bold">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full shadow-lg"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-base">
                    <div>
                      <span className="text-gray-600 font-medium">Client:</span>
                      <p className="font-bold text-gray-900">
                        {project.client}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">
                        System Size:
                      </span>
                      <p className="font-bold text-gray-900">
                        {project.systemSize}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">
                        Location:
                      </span>
                      <p className="font-bold text-gray-900">
                        {project.location}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">
                        Expected Completion:
                      </span>
                      <p className="font-bold text-gray-900">
                        {new Date(
                          project.expectedCompletion
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <span className="text-base text-gray-600 font-medium">
                      Assigned Teams:
                    </span>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {project.assignedTeam.map((team, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold"
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
