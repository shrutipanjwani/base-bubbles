// app/projects/[name]/page.tsx
"use client";

import { useEffect, useState } from "react";
import ModulesFooter from "@/components/ModulesFooter";
import { projectsDetails, ProjectDetails } from "@/data/projects";
import Link from "next/link";
import { useParams } from "next/navigation";

const ProjectPage = () => {
  // Use the useParams hook to get route params
  const params = useParams();
  const projectName = params.name as string;

  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null
  );

  useEffect(() => {
    if (projectName) {
      const details = projectsDetails[projectName];
      if (details) {
        setProjectDetails(details);
      }
    }
  }, [projectName]);

  if (!projectDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Project not found
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen bg-no-repeat bg-cover bg-center bg-[url('/images/modules-bg.svg')] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">
              {projectDetails.name}
            </h1>
            <p className="text-gray-400 mt-2 max-w-3xl">
              {projectDetails.description}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {projectDetails.website && (
              <Link
                href={projectDetails.website}
                target="_blank"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
              >
                Launch App
              </Link>
            )}
          </div>
        </div>
      </div>
      <ModulesFooter />
    </div>
  );
};

export default ProjectPage;
