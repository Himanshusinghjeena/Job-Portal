import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import { setAllAdminJobs, setLoading, setSearchJobByText } from "@/redux/slice/jobSlice";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import Loader from "../shared/Loader";
import { toast } from "sonner";

const AdminJobs = () => {
  const { allAdminJobs, loading } = useSelector((store) => store.job);
  const {companies} = useSelector((store) => store.company);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchAllAdminJobs();
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <>
      {loading ? (
       <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
          <Loader/>
       </div>
      ) : (
        <div className="bg-gray-50 min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <Input
                  className="w-full sm:w-fit"
                  placeholder="Filter by name, role.."
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                />
                <Button
                  className="w-full sm:w-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-lg transition-colors duration-200"
                  onClick={() => { 
                    if(companies.length >0){
                      navigate("/admin/jobs/create")}
                      else{
                        toast.error("Please add a company first to post a job");
                        navigate("/admin/companies");
                      }
                    }
                  }
                >
                  New Jobs
                </Button>
              </div>
              {allAdminJobs && allAdminJobs.length > 0 ? (
                <AdminJobsTable />
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No jobs found. Click 'New Jobs' to post one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminJobs;
