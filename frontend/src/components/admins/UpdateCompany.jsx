import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const UpdateCompany = () => {
  const { id } = useParams();
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
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const company = res.data.company;
          setInput({
            name: company.name || "",
            description: company.description || "",
            website: company.website || "",
            location: company.location || "",
            file: null,
          });
        } else {
          toast.error("Failed to fetch company data");
        }
      } catch (err) {
        toast.error("Error fetching company data");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // Company name is not editable, so no need to append it for update
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Company Updated Successfully");
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
    <div>
      <Navbar />
      <div className=" px-4 sm:px-0 max-w-xl mx-auto my-10">
        <form onSubmit={submitHandler}>
          <div className="flex items-center py-8">
            <Button
              type="button"
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 border-1 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className=" font-semibold sm:font-bold text-[19px] sm:text-2xl text-center pl-10">
              Update Company Details
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="my-2 flex items-center gap-2">
                Company Name
              </Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                disabled={true}
              />
            </div>
            <div>
              <Label className="my-2 flex items-center gap-2">
                Description
              </Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label className="my-2 flex items-center gap-2">
                Website
              </Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label className="my-2 flex items-center gap-2">
                Location
              </Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label className="my-2 flex items-center gap-2">
                Logo
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4 text-lg">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4 text-lg">
              Update Company
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateCompany;
