import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import Loader from "./shared/Loader";

const AppliedJobTable = () => {
  const { loading } = useSelector((store) => store.job);
  const { allAppliedJobs } = useSelector((store) => store.job);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Table>
            <TableCaption>List of Your Applied Jobs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Job Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!allAppliedJobs || allAppliedJobs.length <= 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-20">
                    You Haven't Applied for any Job Till Now.
                  </TableCell>
                </TableRow>
              ) : (
                allAppliedJobs.map((appliedJob) => (
                  <TableRow key={appliedJob._id}>
                    <TableCell>{appliedJob?.createdAt.split("T")[0]}</TableCell>
                    <TableCell>{appliedJob?.job?.title}</TableCell>
                    <TableCell>{appliedJob?.job?.company?.name} </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={`${
                          appliedJob?.status === "rejected"
                            ? "bg-red-400"
                            : appliedJob.status === "pending"
                            ? "bg-gray-400"
                            : "bg-green-400"
                        }`}
                      >
                        {appliedJob.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default AppliedJobTable;
