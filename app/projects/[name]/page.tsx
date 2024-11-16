"use client";

import ModulesFooter from "@/components/ModulesFooter";
import { formatProjectName } from "@/utils/formatting";
import React from "react";

interface ProjectPageProps {
  params: {
    name: string;
  };
}

const ProjectPage: React.FC<ProjectPageProps> = ({ params }) => {
  return (
    <div className="relative isolate bg-no-repeat bg-cover bg-center bg-[url('/images/modules-bg.svg')] overflow-hidden">
      <h1 className="text-white"> {formatProjectName(params.name)}</h1>
      <ModulesFooter />
    </div>
  );
};

export default ProjectPage;
