import React from "react";
import { Label } from "../../ui/label";

const ResumeSection = ({ resume, resumeOriginalName }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Resume</h2>
      <div className="p-3 bg-gray-50 rounded-md border border-gray-100 flex items-center gap-3">
        <Label className="text-base font-medium text-gray-600">File:</Label>
        {resume ? (
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-base hover:underline break-words"
          >
            {resumeOriginalName}
          </a>
        ) : (
          <span className="text-base text-gray-800">N/A</span>
        )}
      </div>
    </div>
  );
};

export default ResumeSection; 