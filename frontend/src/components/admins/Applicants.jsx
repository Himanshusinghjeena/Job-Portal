import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllAplicants, setLoading } from "@/redux/slice/applicationSlice";
import Loader from "../shared/Loader";
import { motion } from "framer-motion";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants, loading } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchAllAPlicants = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          {
            withCredentials: true,
          }
        ); 
        dispatch(setAllAplicants(res.data.job));
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchAllAPlicants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {loading ? (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Applicants Overview
                </h1>
                <p className="text-gray-600 mt-1">
                  Total Applicants: {applicants?.applications?.length || 0}
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <ApplicantsTable />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Applicants;
