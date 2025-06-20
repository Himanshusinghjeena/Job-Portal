import React, { useEffect, useRef, useState } from "react";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import { Bookmark, Share2, Copy, BookmarkCheck } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setSavedJobs } from "@/redux/slice/jobSlice";
import { motion } from "framer-motion";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import Loader from "./shared/Loader";

const SavedJobs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading , setLoading] = useState(false);
  const { savedJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [selectedJob, setSelectedJob] = useState(null);
  const shareableJob = useRef("");

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

  const handleShareClick = (job) => {
    setSelectedJob(job);
    shareableJob.current = `http://localhost:5173/description/${job?._id}`;
  };

  const bookmarkHandler = async (job) => {
    if (user) {
      const previousSavedJobs = [...savedJobs]; // Store current state for potential revert
      const isJobCurrentlySaved = savedJobs.some(savedJob => savedJob._id === job._id);
      let newSavedJobs;

      if (isJobCurrentlySaved) {
        newSavedJobs = savedJobs.filter(savedJob => savedJob._id !== job._id);
      } else {
        newSavedJobs = [...savedJobs, job]; // Add the job to savedJobs
      }
      dispatch(setSavedJobs(newSavedJobs)); // Optimistically update Redux state
      
      try {
        const res = await axios.post(`${JOB_API_END_POINT}/save/${job._id}`, {}, {
          withCredentials: true
        });
        
        if(res.data.success) {
          toast.success(res.data.message);
        } else {
            // If server response is not successful, revert the optimistic update
            dispatch(setSavedJobs(previousSavedJobs)); // Revert to original state
            toast.error(res.data.message || "Failed to update saved job status");
        }
      } catch (err) {
        dispatch(setSavedJobs(previousSavedJobs)); // Revert on error
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={index}
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
                              onClick={() => handleShareClick(job)}
                            >
                              <Share2 className="h-5 w-5 text-gray-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Share Job</DialogTitle>
                              <DialogDescription>
                                Share this job opportunity with your network
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-6">
                              <p className="text-lg font-semibold text-gray-800 mb-4">
                                Share to
                              </p>
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-2 gap-y-4 sm:gap-x-3">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="flex flex-col items-center space-y-1 cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
                                  onClick={() =>
                                    window.open(
                                      "https://www.facebook.com/sharer/sharer.php?u=" +
                                        encodeURIComponent(
                                          `${shareableJob.current}`
                                        ),
                                      "_blank"
                                    )
                                  }
                                >
                                  <FaFacebook className="text-2xl sm:text-3xl text-blue-600" />
                                  <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                                    Facebook
                                  </span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="flex flex-col items-center space-y-1 cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
                                  onClick={() =>
                                    window.open(
                                      "https://twitter.com/intent/tweet?url=" +
                                        encodeURIComponent(
                                          `${shareableJob.current}`
                                        ),
                                      "_blank"
                                    )
                                  }
                                >
                                  <FaXTwitter className="text-2xl sm:text-3xl text-gray-900" />
                                  <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                                    Twitter
                                  </span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="flex flex-col items-center space-y-1 cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
                                  onClick={() =>
                                    window.open(
                                      "https://www.linkedin.com/sharing/share-offsite/?url=" +
                                        encodeURIComponent(
                                          `${shareableJob.current}`
                                        ),
                                      "_blank"
                                    )
                                  }
                                >
                                  <FaLinkedin className="text-2xl sm:text-3xl text-blue-700" />
                                  <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                                    LinkedIn
                                  </span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="flex flex-col items-center space-y-1 cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
                                  onClick={() =>
                                    window.open(
                                      "https://wa.me/?text=" +
                                        encodeURIComponent(
                                          `Check out this job: ${shareableJob.current}`
                                        ),
                                      "_blank"
                                    )
                                  }
                                >
                                  <FaWhatsapp className="text-2xl sm:text-3xl text-green-600" />
                                  <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                                    WhatsApp
                                  </span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="flex flex-col items-center space-y-1 cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
                                  onClick={() =>
                                    window.open(
                                      "https://t.me/share/url?url=" +
                                        encodeURIComponent(
                                          `${shareableJob.current}`
                                        ),
                                      "_blank"
                                    )
                                  }
                                >
                                  <FaTelegram className="text-2xl sm:text-3xl text-blue-500" />
                                  <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                                    Telegram
                                  </span>
                                </Button>
                              </div>
                              <div className="mt-6">
                                <p className="text-lg font-semibold text-gray-800 mb-4">
                                  Or copy link
                                </p>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={shareableJob.current}
                                    readOnly
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        shareableJob.current
                                      );
                                      toast.success("Link copied to clipboard");
                                    }}
                                  >
                                    <Copy className="h-5 w-5 text-gray-500" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-2 rounded-full hover:bg-gray-100"
                          onClick={() => bookmarkHandler(job)}
                        >
                          <BookmarkCheck className="h-5 w-5 text-blue-500" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={job?.company?.logo} />
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-lg text-gray-900">
                          {job?.company?.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {job?.jobLocation}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-900">
                        {job?.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {job?.aboutRole}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                          {job?.jobType}
                        </span>
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                          {job?.experience}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => navigate(`/description/${job?._id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              No Saved Jobs Yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start saving jobs that interest you to keep track of them here.
            </p>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => navigate("/jobs")}
            >
              Browse Jobs
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
