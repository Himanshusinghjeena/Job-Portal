import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSavedJobs } from "@/redux/slice/jobSlice";
import { toast } from "sonner";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import Navbar from "@/components/shared/Navbar";
import Loader from "@/components/shared/Loader";
import SavedJobCard from "./components/SavedJobCard";

const SavedJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { savedJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
        withCredentials: true
      });
      
      if(res.data.success) {
        dispatch(setSavedJobs(res.data.savedJobs));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user) {
      fetchSavedJobs();
    }
  }, [dispatch, user]);

  const bookmarkHandler = async (job) => {
    if (user) {
      const previousSavedJobs = [...savedJobs];
      const isJobCurrentlySaved = savedJobs.some(savedJob => savedJob._id === job._id);
      let newSavedJobs;

      if (isJobCurrentlySaved) {
        newSavedJobs = savedJobs.filter(savedJob => savedJob._id !== job._id);
      } else {
        newSavedJobs = [...savedJobs, job];
      }
      dispatch(setSavedJobs(newSavedJobs));
      
      try {
        const res = await axios.post(`${JOB_API_END_POINT}/save/${job._id}`, {}, {
          withCredentials: true
        });
        
        if(res.data.success) {
          toast.success(res.data.message);
        } else {
          dispatch(setSavedJobs(previousSavedJobs));
          toast.error(res.data.message || "Failed to update saved job status");
        }
      } catch (err) {
        dispatch(setSavedJobs(previousSavedJobs));
        toast.error(err.response?.data?.message || "Failed to update job status");
      }
    } else {
      toast.error("Please login First");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Loader/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {savedJobs?.length > 0 ? (
        <>
          <section className="hero-section text-center py-8 sm:py-12 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Saved Jobs
              </h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Your bookmarked opportunities
              </p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {savedJobs.map((job, index) => (
                <SavedJobCard
                  key={job._id}
                  job={job}
                  index={index}
                  onBookmark={bookmarkHandler}
                  onShare={(job) => {}}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Saved Jobs</h2>
          <p className="text-gray-600 mb-8">
            You haven't saved any jobs yet. Start exploring and save jobs that interest you!
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedJobs; 