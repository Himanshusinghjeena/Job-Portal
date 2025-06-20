import React from "react";
import { Badge } from "../../ui/badge";

const SkillsList = ({ skills = [] }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <Badge
              key={index}
              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
              {skill}
            </Badge>
          ))
        ) : (
          <Badge className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
            N/A
          </Badge>
        )}
      </div>
    </div>
  );
};

export default SkillsList; 