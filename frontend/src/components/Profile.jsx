import React, { useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import AppliedJobAccordion from "./AppliedJobAccordion";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import axios from "axios";
import { USER_API_END_POINT, APPLICATION_API_END_POINT } from "@/utils/constant";
import { useParams, useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ProfileHeader from "./shared/ui/ProfileHeader";
import ContactInfo from "./shared/ui/ContactInfo";
import LoadingState from "./shared/ui/LoadingState";
import EmptyState from "./shared/ui/EmptyState";
import SkillsList from "./shared/ui/SkillsList";
import ResumeSection from "./shared/ui/ResumeSection";
import { UserX } from "lucide-react";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();
  const [applicationStatus, setApplicationStatus] = useState("");
  const [applicationId, setApplicationId] = useState(null);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const jobId = searchParams.get('jobId');

  // Only fetch applied jobs if viewing own profile
  if (!userId) {
    useGetAppliedJobs();
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        try {
          setLoading(true);
          const res = await axios.get(
            `${USER_API_END_POINT}/profile/${userId}${jobId ? `?jobId=${jobId}` : ''}`,
            {
              withCredentials: true,
            }
          );
          if (res.data.success) {
            setProfileData(res.data.user);
            if (res.data.application) {
              setApplicationStatus(res.data.application.status);
              setApplicationId(res.data.application._id);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [userId, jobId]);

  const handleStatusUpdate = async () => {
    if (!applicationStatus || !applicationId) return;

    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
        { status: applicationStatus },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Status updated successfully");
        navigate(-1);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Use profileData if viewing other user's profile, otherwise use current user data
  const displayData = userId ? profileData : user;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-8 p-8 shadow-lg">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-8 p-8 shadow-lg">
          <EmptyState
            icon={UserX}
            title="Profile Not Found"
            description="The profile you're looking for doesn't exist or has been removed."
            actionLabel="Go Back"
            onAction={() => navigate(-1)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8"
        >
          <ProfileHeader
            profilePhoto={displayData?.profile?.profilePhoto}
            fullName={displayData?.fullName}
            bio={displayData?.profile?.bio}
            onEdit={() => setOpen(true)}
            showEditButton={!userId}
          />

          <ContactInfo
            email={displayData?.email}
            phone={displayData?.phoneNumber}
            github={displayData?.profile?.githubUrl}
            linkedin={displayData?.profile?.linkedinUrl}
          />

          <SkillsList skills={displayData?.profile?.skills} />

          <ResumeSection
            resume={displayData?.profile?.resume}
            resumeOriginalName={displayData?.profile?.resumeOriginalName}
          />

          {/* Application Status Section (only shown when viewing from job application) */}
          {jobId && applicationId && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Application Status</h3>
              <div className="flex items-center gap-4">
                <Select
                  value={applicationStatus}
                  onValueChange={setApplicationStatus}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleStatusUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Update Status
                </Button>
              </div>
            </div>
          )}

          {/* Applied Jobs Section (only shown on own profile) */}
          {!userId && <AppliedJobAccordion />}
        </motion.div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
