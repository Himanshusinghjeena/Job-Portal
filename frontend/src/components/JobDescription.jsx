import React, { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setLoading, setSavedJobs, setSingleJob } from "@/redux/slice/jobSlice";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Bookmark, BookmarkCheck, Copy, MapPin, Share2 } from "lucide-react";
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,DialogContent } from "./ui/dialog";

import { FaFacebook, FaLinkedin, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Loader from "./shared/Loader";

const formatJobText = (text) => {
  if (!text) return [];
  
  // First try to split by common bullet point indicators
  const bulletPoints = text.split(/(?:\n|\r\n?|\r)/).filter(line => line.trim());
  
  // If we have multiple lines, treat each as a bullet point
  if (bulletPoints.length > 1) {
    return bulletPoints.map(point => point.trim());
  }
  
  // If it's a single paragraph, try to split by periods followed by capital letters
  const sentences = text.split(/\.\s+(?=[A-Z])/).filter(sentence => sentence.trim());
  
  // If we have multiple sentences, return them as bullet points
  if (sentences.length > 1) {
    return sentences.map(sentence => sentence.trim() + '.');
  }
  
  // If it's a single sentence or no clear separation, return as a single paragraph
  return [text.trim()];
};

const JobDescription = () => {
  const params = useParams();
  const jobId = params.id;
  
  

  const { singleJob,savedJobs,loading } = useSelector((store) => store.job);
  // const {} = useSelector(store=>store.job);

  const [selectedJob, setSelectedJob] = useState(null);
  const shareableJob = useRef("")

  const handleShareClick = (job) => {
    setSelectedJob(job);
    shareableJob.current = `http://localhost:5173/description/${job?._id}`;
  };

  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  // Optimistic UI state for job saved status
  const [isJobSavedOptimistic, setIsJobSavedOptimistic] = useState(false);

  useEffect(() => {
    if (singleJob && user) {
      setIsJobSavedOptimistic(savedJobs.some(savedJob => savedJob._id === singleJob._id));
    }
  }, [singleJob, savedJobs, user]);

  const jobSavedHandler = async (job) => {
    if(user) {
        const previousState = isJobSavedOptimistic;
        setIsJobSavedOptimistic(!previousState); // Optimistic update

        try {
            const res = await axios.post(`${JOB_API_END_POINT}/save/${job._id}`, {}, {
                withCredentials: true
            });
            
            if(res.data.success) {
                // Fetch updated saved jobs to ensure Redux state is in sync
                const savedJobsRes = await axios.get(`${JOB_API_END_POINT}/saved`, {
                    withCredentials: true
                });
                
                if(savedJobsRes.data.success) {
                    dispatch(setSavedJobs(savedJobsRes.data.savedJobs));
                    toast.success(res.data.message);
                }
            }
        } catch (err) {
            setIsJobSavedOptimistic(previousState); // Revert on error
            toast.error(err.response?.data?.message || "Failed to save job");
        }
    } else {
        toast.error('Please login to save jobs');
    }
  }

  const isJobSaved = singleJob ? savedJobs.some(savedJob => savedJob._id === singleJob._id) : false;

  
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success("Job Applied Successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error("Please Login first to Apply");
    }
  };

  const getFileName = (url) => {
    try {
      const parts = url.split("/");
      return parts[parts.length - 1].split(".")[0];
    } catch {
      return "Document";
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`);
        if (res.data.success) {
          dispatch(setSingleJob(res.data.jobs));
          setIsApplied(
            res.data.jobs.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch job details");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchJobDetails();
  }, [dispatch, jobId, user?._id]);

  const isJobExpired = singleJob?.expiryDate && new Date() > new Date(singleJob.expiryDate);

  if (loading) {
    return <Loader />;
  }

  if (!singleJob) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-8">The job you're looking for doesn't exist or has been removed.</p>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 max-w-3xl mx-auto my-6">
      {/* Header section: Job title, Company, Location, Apply/Save/Share buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 capitalize mb-2">
            {singleJob?.title}
          </h1>
          <div className="flex items-center flex-wrap gap-2 text-gray-600">
            {singleJob?.company?.logo && (
              <img src={singleJob.company.logo} alt="Company Logo" className="h-6 w-6 object-contain mr-1" />
            )}
            {singleJob?.company?.name && (
              <span className="text-lg font-medium text-blue-600">
                {singleJob.company.name}
              </span>
            )}
            {singleJob?.jobLocation && (
              <span className="flex items-center text-lg ml-2">
                <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                {singleJob.jobLocation}, India
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={isApplied || isJobExpired ? null : applyJobHandler}
            disabled={isApplied || isJobExpired}
            className={`px-6 py-3 rounded-lg text-white font-medium ${isApplied || isJobExpired ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
          >
            {isJobExpired ? "Expired" : (isApplied ? "Already Applied" : "Apply Now")}
          </Button>
          <Button
            onClick={() => { jobSavedHandler(singleJob); }}
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
                onClick={() => handleShareClick(singleJob)}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="flex flex-col items-center">
                <DialogTitle className="text-2xl font-bold mt-4">
                  Share with Friends
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-center">
                  A single share can open a door for someone.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6">
                <p className="text-lg font-medium mb-2">
                  Share your link
                </p>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                  <input
                    type="text"
                    value={`${shareableJob.current}`}
                    readOnly
                    className="flex-1 outline-none bg-transparent"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${shareableJob.current}`
                      );
                      toast.success(
                        "The job link has been copied to your clipboard!!"
                      );
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-lg font-medium mb-4">
                  Share to
                </p>
                <div className="flex justify-around space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex flex-col items-center space-y-1 cursor-pointer"
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
                    <FaFacebook className="text-blue-600 text-3xl" />
                    <span className="text-xs text-gray-600">
                      Facebook
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex flex-col items-center space-y-1 cursor-pointer"
                    onClick={() =>
                      window.open(
                        "https://twitter.com/intent/tweet?url=" +
                          encodeURIComponent(
                            `${shareableJob.current}`
                          ) +
                          "&text=" +
                          encodeURIComponent("Check this out!"),
                        "_blank"
                      )
                    }
                  >
                    <FaXTwitter className="text-black text-3xl" />
                    <span className="text-xs text-gray-600">
                      X
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex flex-col items-center space-y-1 cursor-pointer"
                    onClick={() =>
                      window.open(
                        "https://wa.me/?text=" +
                          encodeURIComponent(
                            `Check this out: ${shareableJob.current}`
                          ),
                        "_blank"
                      )
                    }
                  >
                    <FaWhatsapp className="text-green-500 text-3xl" />
                    <span className="text-xs text-gray-600">
                      Whatsapp
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex flex-col items-center space-y-1 cursor-pointer"
                    onClick={() =>
                      window.open(
                        "https://t.me/share/url?url=" +
                          encodeURIComponent(
                            `${shareableJob.current}`
                          ) +
                          "&text=" +
                          encodeURIComponent(
                            "Check out this Amazing opportunity!"
                          ),
                        "_blank"
                      )
                    }
                  >
                    <FaTelegram className="text-blue-400 text-3xl" />
                    <span className="text-xs text-gray-600">
                      Telegram
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex flex-col items-center space-y-1 cursor-pointer"
                    onClick={() =>
                      window.open(
                        "https://www.linkedin.com/sharing/share-offsite/?url=" +
                          encodeURIComponent(
                            `Check this out: ${shareableJob.current}`
                          ),
                        "_blank"
                      )
                    }
                  >
                    <FaLinkedin className="text-blue-700 text-3xl" />
                    <span className="text-xs text-gray-600">
                      Linkedin
                    </span>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Badges section */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {singleJob?.experience && (
          <Badge className="text-blue-700 font-bold px-3 py-1 border border-blue-200 bg-blue-50">
            {singleJob.experience}
          </Badge>
        )}
        {singleJob?.jobType && (
          <Badge className="text-red-600 font-bold px-3 py-1 border border-red-200 bg-red-50">
            {singleJob.jobType}
          </Badge>
        )}
        {singleJob?.workMode && (
          <Badge className="text-purple-700 font-bold px-3 py-1 border border-purple-200 bg-purple-50">
            {singleJob.workMode}
          </Badge>
        )}
        {singleJob?.salary && singleJob.salary !== 0 && (
          <Badge className="text-green-700 font-bold px-3 py-1 border border-green-200 bg-green-50">
            ₹{singleJob.salary.toLocaleString()}/month
          </Badge>
        )}
        {singleJob?.expiryDate && (
          <Badge className="text-orange-700 font-bold px-3 py-1 border border-orange-200 bg-orange-50">
            Expires: {new Date(singleJob.expiryDate).toLocaleDateString()}
          </Badge>
        )}
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Role</h2>
          <div className="bg-gray-100 text-gray-700 p-4 rounded-lg leading-relaxed">
            {singleJob?.aboutRole || "Role of the job "}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibility</h2>
          <div className="bg-gray-100 text-gray-700 p-4 rounded-lg leading-relaxed">
            <ul className="list-disc ml-5 space-y-2">
              {formatJobText(singleJob?.responsibility).map((point, index) => (
                <li key={index} className="text-gray-700">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Educational Qualification</h2>
          <div className="bg-gray-100 text-gray-700 p-4 rounded-lg leading-relaxed">
            <ul className="list-disc ml-5 space-y-2">
              {formatJobText(singleJob?.educationalQualification).map((point, index) => (
                <li key={index} className="text-gray-700">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
          <div className="bg-gray-100 text-gray-700 p-4 rounded-lg leading-relaxed">
            <ul className="list-disc ml-5 space-y-2">
              {formatJobText(singleJob?.skills).map((point, index) => (
                <li key={index} className="text-gray-700">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Attachments Section */}
        {(singleJob?.attachJD || singleJob?.attachCompany) && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Attachments</h2>
            <div className="bg-gray-100 p-4 rounded-lg flex flex-wrap gap-4">
              {singleJob?.attachJD && (
                <a
                  href={singleJob.attachJD}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer w-32 h-32 text-center"
                >
                  <img
                    src="https://img.icons8.com/fluency/48/pdf.png"
                    alt="PDF icon"
                    className="w-10 h-10 mb-2"
                  />
                  <p className="text-sm font-medium text-blue-700 truncate w-full">
                    Job Description
                  </p>
                </a>
              )}
              {singleJob?.attachCompany && (
                <a
                  href={singleJob.attachCompany}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer w-32 h-32 text-center"
                >
                  <img
                    src="https://img.icons8.com/color/48/image.png"
                    alt="Image icon"
                    className="w-10 h-10 mb-2"
                  />
                  <p className="text-sm font-medium text-green-700 truncate w-full">
                    About Company
                  </p>
                </a>
              )}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Perks & Benefits</h2>
          <div className="bg-gray-100 text-gray-700 p-4 rounded-lg leading-relaxed">
            <ul className="list-disc ml-5 space-y-2">
              {formatJobText(singleJob?.perks).map((point, index) => (
                <li key={index} className="text-gray-700">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobDescription;
