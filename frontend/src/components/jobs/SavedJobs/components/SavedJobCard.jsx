import React from 'react';
import { Button } from "@/components/ui/button";
import { Bookmark, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ShareDialog from './ShareDialog';

const SavedJobCard = ({ job, index, onBookmark, onShare }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {new Date(job?.createdAt).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => onShare(job)}
                >
                  <Share2 className="h-5 w-5 text-gray-500" />
                </Button>
              </DialogTrigger>
              <ShareDialog job={job} />
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => onBookmark(job)}
            >
              <Bookmark className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>

        <div 
          className="cursor-pointer"
          onClick={() => navigate(`/description/${job._id}`)}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            {job.company?.logo && (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-8 h-8 rounded-full object-contain"
              />
            )}
            <span className="text-gray-600">{job.company?.name}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {job.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{job.jobLocation}</span>
            <span>{job.jobType}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SavedJobCard; 