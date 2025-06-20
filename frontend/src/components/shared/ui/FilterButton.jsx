import React from "react";
import { Button } from "../../ui/button";
import { FilterIcon, X } from "lucide-react";

const FilterButton = ({ type = "filter", onClick, className = "" }) => {
  const isClear = type === "clear";
  
  return (
    <Button
      variant="outline"
      className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${className}`}
      onClick={onClick}
    >
      {isClear ? (
        <X className="h-5 w-5" />
      ) : (
        <FilterIcon className="h-5 w-5" />
      )}
      {isClear ? "Clear Filters" : "Filters"}
    </Button>
  );
};

export default FilterButton; 