import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setSavedJobs, setSingleJob } from "@/redux/slice/jobSlice";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import JobHeader from "./components/JobHeader";
import JobActions from "./components/JobActions";

const JobDescription = () => {
  const params = useParams();
  const jobId = params.id;
  const { singleJob, savedJobs, loading } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  // Optimistic UI state for job saved status
  const [isJobSavedOptimistic, setIsJobSavedOptimistic] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    if (singleJob) {
      setIsJobSavedOptimistic(savedJobs.some(savedJob => savedJob._id === singleJob._id));
    }
  }, [singleJob, savedJobs]);

  const jobSavedHandler = async (job) => {
    if(user) {
      const previousState = isJobSavedOptimistic;
      setIsJobSavedOptimistic(!previousState); // Optimistic update

      try {
        const res = await axios.post(`${JOB_API_END_POINT}/save/${job._id}`, {}, {
          withCredentials: true
        });
        
        if(res.data.success) {
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
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <JobHeader job={singleJob} />
        <JobActions
          job={singleJob}
          isApplied={isApplied}
          isJobExpired={isJobExpired}
          isJobSavedOptimistic={isJobSavedOptimistic}
          onApply={applyJobHandler}
          onSave={() => jobSavedHandler(singleJob)}
          onShare={(job) => {}}
        />
      </div>

      {/* Job Details Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Job Description</h2>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: singleJob?.description }} />
        </div>
      </div>

      {/* Requirements Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Requirements</h2>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: singleJob?.requirements }} />
        </div>
      </div>

      {/* Company Information */}
      {singleJob?.company && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">About Company</h2>
          <div className="flex items-start gap-4">
            {singleJob.company.logo && (
              <img
                src={singleJob.company.logo}
                alt={singleJob.company.name}
                className="w-16 h-16 object-contain rounded-lg"
              />
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {singleJob.company.name}
              </h3>
              <p className="text-gray-600 mt-1">
                {singleJob.company.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescription; 