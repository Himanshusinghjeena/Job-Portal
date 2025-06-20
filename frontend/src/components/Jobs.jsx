import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import { useSelector, useDispatch } from "react-redux";
import { resetFilteredJobs, setSavedJobs } from "../redux/slice/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import SearchBar from "./shared/ui/SearchBar";
import FilterButton from "./shared/ui/FilterButton";
import NoResults from "./shared/ui/NoResults";
import MobileFilterDrawer from "./shared/ui/MobileFilterDrawer";
import JobGrid from "./shared/ui/JobGrid";

const Jobs = () => {
  useGetAllJobs();
  const dispatch = useDispatch();
  const { filteredJobs, allJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [searchedJobs, setSearchedJobs] = useState(allJobs);
  const [search, setSearch] = useState("");
  const [clearFiltersSignal, setClearFiltersSignal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    "Locations": "",
    "Experience": "",
    "Job Types": "",
  });

  useEffect(() => {
    dispatch(resetFilteredJobs());
  }, [dispatch]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (user) {
        try {
          const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
            withCredentials: true
          });
          
          if(res.data.success) {
            dispatch(setSavedJobs(res.data.savedJobs));
          }
        } catch (err) {
          console.error("Failed to fetch saved jobs:", err);
        }
      }
    };

    fetchSavedJobs();
  }, [dispatch, user]);

  useEffect(() => {
    const sortedAllJobs = [...allJobs].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || a.postedDate);
      const dateB = new Date(b.date || b.createdAt || b.postedDate);
      return dateB - dateA;
    });
    setSearchedJobs(sortedAllJobs);
  }, [allJobs]);

  useEffect(() => {
    const sortedFilteredJobs = [...filteredJobs].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || a.postedDate);
      const dateB = new Date(b.date || b.createdAt || b.postedDate);
      return dateB - dateA;
    });
    setSearchedJobs(sortedFilteredJobs);
  }, [filteredJobs, allJobs]);

  useEffect(() => {
    if (!search.trim()) {
      setSearchedJobs(filteredJobs);
      return;
    }

    const searchFilteredJobs = filteredJobs.filter((job) => {
      return (
        job?.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        job?.aboutRole.toLowerCase().includes(search.trim().toLowerCase()) ||
        job?.jobLocation.toLowerCase().includes(search.trim().toLowerCase()) ||
        job?.company.name.toLowerCase().includes(search.trim().toLowerCase())
      );
    });

    setSearchedJobs(searchFilteredJobs);
  }, [filteredJobs, search]);

  const clearSearchHandler = () => {
    setSearch("");
    setSearchedJobs(allJobs);
    setClearFiltersSignal((prev) => !prev);
    dispatch(resetFilteredJobs());
  };

  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  // Reset clearFiltersSignal after it's been processed
  useEffect(() => {
    if (clearFiltersSignal) {
      const timer = setTimeout(() => {
        setClearFiltersSignal(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [clearFiltersSignal]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {/* Search Bar Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={clearSearchHandler}
            />
            <div className="flex gap-2">
              <FilterButton
                type="filter"
                onClick={() => setShowMobileFilters(true)}
                className="sm:hidden"
              />
              <FilterButton
                type="clear"
                onClick={clearSearchHandler}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <div className="flex flex-col sm:flex-row gap-6 h-full">
            {/* Filter Card - Desktop */}
            <div className="hidden sm:block w-[300px] flex-shrink-0 h-full overflow-y-auto pr-2">
              <FilterCard 
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                clearFiltersSignal={clearFiltersSignal}
              />
            </div>

            {/* Filter Card - Mobile */}
            <MobileFilterDrawer
              isOpen={showMobileFilters}
              onClose={() => setShowMobileFilters(false)}
            >
              <FilterCard
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                isMobile={true}
                onClose={() => setShowMobileFilters(false)}
                clearFiltersSignal={clearFiltersSignal}
              />
            </MobileFilterDrawer>

            {/* Jobs Grid */}
            <div className="flex-1 h-[110vh] overflow-y-auto">
              {searchedJobs.length <= 0 ? (
                <NoResults onClear={clearSearchHandler} showClearButton={false} />
              ) : (
                <JobGrid jobs={searchedJobs} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
