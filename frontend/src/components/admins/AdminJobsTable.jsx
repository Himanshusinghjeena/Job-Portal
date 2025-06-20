import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Edit2, Eye, EyeIcon, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
// import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";



const AdminJobsTable = () => {
  const navigate = useNavigate();

  // useGetAllAdminJobs();

  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
 
  const [filterJobs, setFilterJobs] = useState([]);
 
  useEffect(() => {
    const filteredJobs = (allAdminJobs || []).filter((job) => {
      if (!searchJobByText) return true;
      return (
        job.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableCaption className="sr-only">A List of Your Recent Posted Jobs</TableCaption>
          <TableHeader className="bg-gray-50">
            <TableRow className="bg-gray-100/50">
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">Company Name</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Posted</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Applicants</TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {filterJobs.length <= 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No jobs posted yet. Start by posting a new job!
                </TableCell>
              </TableRow>
            ) : (
              filterJobs.map((job) => (
                <TableRow className="hover:bg-gray-50 transition-colors duration-150" key={job._id}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job?.company?.name || "N/A"}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job?.title || "N/A"}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job?.createdAt?.split("T")[0] || "N/A"}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    {job.pendingApplicationsCount > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {job.pendingApplicationsCount} New
                      </span>
                    ) : (
                      <span className="text-gray-500">0 New</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Popover>
                      <PopoverTrigger className="outline-none rounded-md">
                        <MoreHorizontal className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={5} className="z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden py-1 w-32">
                        {/* <div
                          onClick={() => navigate(`/admin/jobs/${job._id}`)}
                          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit</span>
                        </div> */}
                        <div
                          onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                          className="flex items-center w-fit gap-2 p-1 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>Applicants</span>
                        </div>
                        {/* <div
                          onClick={() => navigate(``)}
                          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                        >
                          <FaRegEye className="h-4 w-4 " />

                          <EyeIcon />
                          <span>Applicants</span>
                        </div> */}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminJobsTable;
