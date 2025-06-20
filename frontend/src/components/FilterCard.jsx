import React, { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useSelector, useDispatch } from "react-redux";
import { setFilteredJobs } from "@/redux/slice/jobSlice"; 
import { Button } from "./ui/button";
import { X } from "lucide-react";

const filters = [
  {
    filterType: "Locations",
    array: ["Noida", "Bangalore", "Delhi", "Pune", "Hyderabad", "Mumbai"],
  },
  {
    filterType: "Experience",
    array: ["Freshers", '0-1','1-3','3-5','5+'],
  },
  {
    filterType: "Job Types",
    array: ["Part Time", "Full Time", "Internship"],
  },
];

const FilterCard = ({ clearFiltersSignal, isMobile, onClose, selectedFilters, onFilterChange }) => {
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  const applyFilters = (updatedFilters) => {
    const filtered = allJobs.filter((job) => {
      const locationMatch = updatedFilters["Locations"]
        ? job.jobLocation === updatedFilters["Locations"]
        : true;
      const experienceMatch = updatedFilters["Experience"]
        ? job.experience.split(" ")[0] === updatedFilters["Experience"]
        : true;
      const jobTypeMatch = updatedFilters["Job Types"]
        ? job.jobType === updatedFilters["Job Types"]
        : true;

      return locationMatch && experienceMatch && jobTypeMatch;
    });

    dispatch(setFilteredJobs(filtered));
  };

  const handleFilterChange = (filterType, value) => {
    const updatedFilters = {
      ...selectedFilters,
      [filterType]: value,
    };

    onFilterChange(updatedFilters);
    applyFilters(updatedFilters);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      "Locations": "",
      "Experience": "",
      "Job Types": "",
    };
    onFilterChange(resetFilters);
    applyFilters(resetFilters);
  };

  useEffect(() => {
    if (clearFiltersSignal) {
      clearAllFilters();
    }
  }, [clearFiltersSignal]);

  return (
    <div
      className={`${
        isMobile
          ? 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'
          : 'w-full border border-gray-200 rounded-lg px-4 py-6 shadow-sm overflow-x-hidden'
      }`}
    >
      <div
        className={`${
          isMobile
            ? 'w-full h-full bg-white flex flex-col'
            : ''
        }`}
      >
        {isMobile && (
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h1 className="font-bold text-xl">Filter Jobs</h1>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </Button>
          </div>
        )}
        {!isMobile && <h1 className="font-bold text-2xl text-gray-800 mb-4">Filter Jobs</h1>}
        {!isMobile && <hr className="my-4 border-gray-200" />}
        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4 pb-20' : ''}`}>
          {filters.map((filter, index) => (
            <div key={index} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h1 className="font-semibold text-lg text-gray-700">{filter.filterType}</h1>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  onClick={() => {
                    const updatedFilters = {
                      ...selectedFilters,
                      [filter.filterType]: "",
                    };
                    onFilterChange(updatedFilters);
                    applyFilters(updatedFilters);
                  }}
                >
                  Clear
                </button>
              </div>
              <RadioGroup
                value={selectedFilters[filter.filterType]}
                onValueChange={(value) =>
                  handleFilterChange(filter.filterType, value)
                }
              >
                {filter.array.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 my-0">
                    <RadioGroupItem id={`${filter.filterType}-${idx}`} value={item} />
                    <Label htmlFor={`${filter.filterType}-${idx}`} className="text-base text-gray-600 cursor-pointer">
                      {item}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </div>
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50">
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition-colors duration-200" onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default FilterCard;