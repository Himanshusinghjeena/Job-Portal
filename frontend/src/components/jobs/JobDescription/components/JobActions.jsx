import React from 'react';
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ShareDialog from './ShareDialog';

const JobActions = ({ 
  job, 
  isApplied, 
  isJobExpired, 
  isJobSavedOptimistic, 
  onApply, 
  onSave, 
  onShare 
}) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={isApplied || isJobExpired ? null : onApply}
        disabled={isApplied || isJobExpired}
        className={`px-6 py-3 rounded-lg text-white font-medium ${
          isApplied || isJobExpired 
            ? "bg-gray-600 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
        }`}
      >
        {isJobExpired ? "Expired" : (isApplied ? "Already Applied" : "Apply Now")}
      </Button>
      
      <Button
        onClick={onSave}
        variant="outline"
        size="icon"
        className="p-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
      >
        {isJobSavedOptimistic ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="p-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            size="icon"
            onClick={() => onShare(job)}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <ShareDialog job={job} />
      </Dialog>
    </div>
  );
};

export default JobActions; 