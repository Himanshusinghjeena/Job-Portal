import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";

const CompanySetup = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  useEffect(() => {
    if (location.state && location.state.companyName) {
      setInput((prev) => ({ ...prev, name: location.state.companyName }));
    }
  }, [location.state]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.file) {
      toast.error("Company logo is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/registerCompany`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Company Registered Successfully");
        navigate("/admin/companies");
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <form onSubmit={submitHandler}>
            <div className="flex items-center gap-4 mb-8">
              <Button
                type="button"
                onClick={() => navigate("/admin/companies")}
                variant="outline"
                className="flex items-center gap-2 text-gray-700 font-semibold px-4 py-2.5 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Button>
              <h1 className="font-bold text-2xl sm:text-3xl text-gray-900">Company Details</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Company Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</Label>
                <Input
                  id="description"
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">Website</Label>
                <Input
                  id="website"
                  type="text"
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</Label>
                <Input
                  id="location"
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="w-full px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-center file:py-0 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
            {loading ? (
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-lg transition-colors duration-200" disabled>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
              </Button>
            ) : (
              <Button type="submit" className=" w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-lg transition-colors duration-200">
                Register Company
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
