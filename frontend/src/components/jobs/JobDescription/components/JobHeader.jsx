import React from 'react';
import { MapPin } from 'lucide-react';

const JobHeader = ({ job }) => {
  return (
    <div className="mb-4 sm:mb-0">
      <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 capitalize mb-2">
        {job?.title}
      </h1>
      <div className="flex items-center flex-wrap gap-2 text-gray-600">
        {job?.company?.logo && (
          <img src={job.company.logo} alt="Company Logo" className="h-6 w-6 object-contain mr-1" />
        )}
        {job?.company?.name && (
          <span className="text-lg font-medium text-blue-600">
            {job.company.name}
          </span>
        )}
        {job?.jobLocation && (
          <span className="flex items-center text-lg ml-2">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            {job.jobLocation}, India
          </span>
        )}
      </div>
    </div>
  );
};

export default JobHeader; 