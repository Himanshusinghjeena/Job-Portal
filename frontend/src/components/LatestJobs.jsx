import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const LatestJobs = () => {
  const navigate = useNavigate();
  const { allJobs } = useSelector((store) => store.job);
  // Sort jobs by createdAt descending to show latest jobs first
  const sortedJobs = allJobs
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900">
            <span className="text-blue-500">2000+ </span> 
            Dream Job Openings
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore thousands of job opportunities and find your dream job with our comprehensive job search platform.
          </p>
        </div>

        {/* Jobs Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {sortedJobs.length <= 0 ? (
            <div className="col-span-full flex justify-center items-center h-32">
              <span className="text-lg text-gray-600">No Jobs Available</span>
            </div>
          ) : (
            sortedJobs
              .slice(0, 6)
              .map((job) => <LatestJobCards key={job._id} job={job} />)
          )}
        </div>

        {/* Load More Button Section */}
        <div className="flex justify-center mt-8 sm:mt-12">
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-base sm:text-lg rounded-md transition-colors duration-200"
            onClick={() => navigate('/jobs')}
          >
            Load More Jobs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LatestJobs;
