// app/page.tsx
"use client";

import { Suspense } from "react";
import Loading from "@/components/Loading";
import { PageHeader } from "@/components/PageHeader";
import { ProjectsSection } from "@/components/ProjectsSection";
import ModulesFooter from "@/components/ModulesFooter";

export default function Home() {
  return (
    <div className="h-full relative isolate bg-no-repeat bg-cover bg-center bg-[url('/modules-bg.svg')] overflow-hidden">
      <Suspense fallback={<Loading />}>
        <PageHeader />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <ProjectsSection />
      </Suspense>

      <ModulesFooter />
    </div>
  );
}
