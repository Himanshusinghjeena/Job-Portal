import React from "react";
import { Button } from "../../ui/button";
import { SearchX } from "lucide-react";

const NoResults = ({ 
  title = "No Results Found", 
  description = "Try adjusting your search or filter criteria to find what you're looking for.",
  onClear,
  showClearButton = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <img
        src="https://cdni.iconscout.com/illustration/premium/thumb/unemployment-holding-no-job-found-illustration-download-in-svg-png-gif-file-formats--business-unemployed-empty-state-pack-people-illustrations-10922141.png?f=webp"
        alt="No results found"
        className="w-64 h-64 object-contain mb-6"
      />
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {showClearButton && onClear && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onClear}
          >
            <SearchX className="h-5 w-5" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default NoResults; 