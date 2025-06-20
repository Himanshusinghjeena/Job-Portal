import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal, FileText, Mail, Phone, Calendar, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
// import { addViewedApplication } from "@/redux/slice/viewedApplicationsSlice";

// const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleApplicationView = async (applicationId, applicantId, jobId) => {
    try {
      // Check if we've already sent a notification for this application
      // Send notification
      await axios.post(`${APPLICATION_API_END_POINT}/notify-viewed/${applicationId}`, {}, {
        withCredentials: true
      });
      
      // Navigate to profile
      navigate(`/profile/${applicantId}?jobId=${jobId}`);
    } catch (error) {
      console.error('Error sending notification:', error);
      // Still navigate even if notification fails
      navigate(`/profile/${applicantId}?jobId=${jobId}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "viewed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="text-gray-500">A list of all applicants for this position</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-900">Applicant</TableHead>
            <TableHead className="font-semibold text-gray-900">Contact</TableHead>
            <TableHead className="font-semibold text-gray-900">Resume</TableHead>
            <TableHead className="font-semibold text-gray-900">Applied Date</TableHead>
            <TableHead className="font-semibold text-gray-900">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants && applicants?.applications?.length > 0 ? (
            applicants.applications.map((item) => (
              <TableRow
                key={item._id}
                className={`${
                  item.status.toLowerCase() === "pending" || item.status.toLowerCase() === "viewed"
                    ? "hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    : "cursor-not-allowed"
                }`}
                onClick={() => {
                  if ((item.status.toLowerCase() === "pending" || item.status.toLowerCase() === "viewed") && item.applicant) {
                    handleApplicationView(item._id, item.applicant._id, item.job);
                  }
                }}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item?.applicant?.fullName || "N/A"}</p>
                      <p className="text-sm text-gray-500">{item?.applicant?.email || "N/A"}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{item?.applicant?.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{item?.applicant?.phoneNumber || "N/A"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {item?.applicant?.profile?.resume ? (
                    <span
                      className={`inline-flex items-center gap-2 text-blue-600 ${
                        !(item.status.toLowerCase() === "pending" || item.status.toLowerCase() === "viewed")
                          ? "opacity-50" : ""
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{item?.applicant?.profile?.resumeOriginalName || "Resume Attached"}</span>
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">No resume uploaded</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {item?.applicant?.createdAt ? new Date(item.applicant.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item?.status)}>
                    {item?.status || "N/A"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No applicants found for this position
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
