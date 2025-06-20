import React, { useState } from "react";
import Navbar from "../components/shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const companyArray = [];
const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    experience: "",
    jobType: "",
    position: 0,
    companyId: "",
  });
  const [loading,setLoading]= useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler =(value)=>{
    const selectedCompany  = companies.find((company)=>company.name.toLowerCase() === value);
    setInput({...input,companyId:selectedCompany._id});
  }

  const submitHandler = async(e)=>{
    e.preventDefault();
   
    try{
        setLoading(true);
        const res = await axios.post(`${JOB_API_END_POINT}/post`,input,{
            headers:{
                'Content-Type': 'application/json',
            },
            withCredentials:true
        });
      
        if(res.data.success){
            toast.success("Job Posted Successfully");
            navigate('/admin/jobs');
        }
    }catch(err){
        toast.error(err.message)
    }finally{
        setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form onSubmit={submitHandler} className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                placeholder="Enter job title"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                placeholder="Enter job desc.."
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                placeholder="Enter job requirements"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                placeholder="Enter Salary"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                placeholder="Enter Location"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Input
                type="number"
                placeholder="Enter Experience You need"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                placeholder="Enter JobType"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>No. Of Position</Label>
              <Input
                type="text"
                placeholder="Enter How many positions need"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
              />
            </div>
            {companies.length > 0 && (
              <Select onValueChange={selectChangeHandler}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies.map((company) => {
                      return (
                        <SelectItem value={company?.name?.toLowerCase()}>
                          {company?.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

         {loading ? (
            <Button className="w-full my-4 text-lg">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4 text-lg">
              Post New Job
            </Button>
          )}
          {companies.length === 0 && (
            <p className="text-sm text-red-600 font-bold text-center my-3">
              *Please Register a Company first, before Posting a Job{" "}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
