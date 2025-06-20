import React from "react";
import { Label } from "../../ui/label";

const RoleSelector = ({ selectedRole, onChange }) => {
  return (
    <div className="sm:w-1/2">
      <Label>Registering As</Label>
      <div className="flex gap-6 mt-2">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="student"
            name="role"
            value="Student"
            checked={selectedRole === "Student"}
            onChange={onChange}
            className="cursor-pointer  to-blue-700 w-4 h-4"
          />
          <Label htmlFor="student">Student</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="recruiter"
            name="role"
            value="Recruiter"
            checked={selectedRole === "Recruiter"}
            onChange={onChange}
            className="cursor-pointer  to-blue-700 w-4 h-4"
          />
          <Label htmlFor="recruiter">Recruiter</Label>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector; 