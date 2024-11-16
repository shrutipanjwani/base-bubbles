import React from "react";
import Link from "next/link";

const ModulesFooter = () => {
  return (
    <footer className="mt-24">
      <div className="w-full mx-auto max-w-7xl py-6 flex justify-end px-2 lg:px-6">
        <p className="text-gray-400 text-sm">
          Have any feedbacks? DM Shrutz on{" "}
          <Link
            href="https://warpcast.com/shrutz"
            target="_blank"
            className="text-blue-500 underline"
          >
            Warpcast
          </Link>{" "}
          or{" "}
          <Link
            href="https://x.com/shrutipanjwani_"
            target="_blank"
            className="text-blue-500 underline"
          >
            X
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default ModulesFooter;
