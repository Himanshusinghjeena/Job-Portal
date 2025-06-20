import React from "react";
import { motion } from "framer-motion";
import Job from "../../Job";

const JobGrid = ({ jobs }) => {
  if (!jobs.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {jobs.map((job) => (
        <motion.div
          key={job._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Job job={job} />
        </motion.div>
      ))}
    </div>
  );
};

export default JobGrid; 