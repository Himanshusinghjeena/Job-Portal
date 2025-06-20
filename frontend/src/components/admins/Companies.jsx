import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch, useSelector } from "react-redux";
import { setSearchCompanyByText } from "@/redux/slice/companySlice";
import { setLoading } from "@/redux/slice/companySlice";
import Loader from "../shared/Loader";

const Companies = () => {
  const { companies, loading } = useSelector((store) => store.company);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetAllCompanies();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <Input
              className="w-full sm:w-fit"
              placeholder="Filter by name"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <Button
              className="w-full sm:w-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-lg transition-colors duration-200"
              onClick={() => navigate("/admin/companies/create")}
            >
              New Company
            </Button>
          </div>
          {companies && companies.length > 0 ? (
            <CompaniesTable />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No companies found. Click 'New Company' to add one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Companies;
