import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { toast } from "sonner";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { setSingleJob } from "@/redux/slice/jobSlice";
import { useNavigate } from "react-router-dom";

function JobPost() {
  useGetAllCompanies();
  const allCompanies = useSelector(store => store.company.companies);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("title");
  const [loading,setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    jobType: "",
    workMode: "",
    jobLocation: "",
    experience: "",
    company: "",
    aboutRole: "",
    educationalQualification: "",
    skills: "",
    responsibility: "",
    attachmentsAboutCompany: null,
    attachmentsJobDescription: null,
    salary: "",
    recruiterName: "",
    email: "",
    perksAndBenefits: "",
    expiryDate: "",
  });

  const tabOrder = [
    "title",
    "aboutRole",
    "qualification",
    "responsibility",
    "attachments",
    "others",
  ];

  const handleContinue = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handlePostJob = async () => {
    try {
      if (!formData.title) {
        toast.error("Job Title is required.");
        return;
      }
      if (!formData.jobType) {
        toast.error("Job Type is required.");
        return;
      }
      if (!formData.workMode) {
        toast.error("Work Mode is required.");
        return;
      }
      if (!formData.jobLocation) {
        toast.error("Job Location is required.");
        return;
      }
      if (!formData.experience) {
        toast.error("Experience is required.");
        return;
      }
      if (!formData.company) {
        toast.error("Company is required.");
        return;
      }
      if (!formData.aboutRole) {
        toast.error("About Role is required.");
        return;
      }
      if (!formData.educationalQualification) {
        toast.error("Educational Qualification is required.");
        return;
      }
      if (!formData.skills) {
        toast.error("Skills is required.");
        return;
      }
      if (!formData.responsibility) {
        toast.error("Responsibility is required.");
        return;
      }
      if (!formData.perksAndBenefits) {
        toast.error("Perks & Benefits is required.");
        return;
      }

      if (formData.expiryDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to start of day
        const selectedDate = new Date(formData.expiryDate);
        selectedDate.setHours(0, 0, 0, 0); // Normalize selected date to start of day

        if (selectedDate < today) {
          toast.error("Expiry Date cannot be in the past.");
          return;
        }
      }
      // Add more validation as needed for other fields before submission.

      setLoading(true);
      const form = new FormData();

      form.append("title", formData.title);
      form.append("jobType", formData.jobType);
      form.append("workMode", formData.workMode);
      form.append("jobLocation", formData.jobLocation);
      form.append("experience", formData.experience);
      form.append("company", formData.company);
      form.append("aboutRole", formData.aboutRole);
      form.append(
        "educationalQualification",
        formData.educationalQualification
      );
      form.append("skills", formData.skills);
      form.append("responsibility", formData.responsibility);
      form.append("salary", formData.salary);
      form.append("name", formData.recruiterName);
      form.append("email", formData.email);
      form.append("perks", formData.perksAndBenefits);
      if (formData.expiryDate) {
        form.append("expiryDate", formData.expiryDate);
      }

      if (formData.attachmentsJobDescription) {
        form.append("attachmentsJobDescription", formData.attachmentsJobDescription);
      }
      if (formData.attachmentsAboutCompany) {
        form.append("attachmentsAboutCompany", formData.attachmentsAboutCompany);
      }

      const res = await axios.post(`${JOB_API_END_POINT}/post`, form, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
        toast.success("Job Posted Successfully");
        navigate('/admin/jobs');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to post job");
    }
    finally{
      setLoading(false);
    }

    setFormData({
      title: "",
      jobType: "",
      workMode: "",
      jobLocation: "",
      experience: "",
      company: "",
      aboutRole: "",
      educationalQualification: "",
      skills: "",
      responsibility: "",
      attachmentsAboutCompany: null,
      attachmentsJobDescription: null,
      salary: "",
      recruiterName: "",
      email: "",
      perksAndBenefits: "",
      expiryDate: "",
    });

    setActiveTab("title");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col h-full overflow-hidden">
          <div className="relative flex items-center justify-center mb-10">
            <Button
                type="button"
                onClick={() => navigate("/admin/jobs")}
                variant="outline"
                className="absolute left-0 flex items-center gap-2 text-gray-700 font-semibold px-4 py-2.5 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
            </Button>
            <h1 className="font-bold text-2xl sm:text-4xl text-gray-900">Post Job</h1>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col sm:flex-row gap-6 flex-1"
          >
            <TabsList className="bg-white px-4 rounded-xl flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible justify-start items-start w-full sm:w-[200px] flex-shrink-0 border-r border-gray-200 border-2 sm:border-0 sm:space-y-4 ">
              <TabsTrigger
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4  py-3 text-base font-medium w-full text-left transition-all duration-200 hover:bg-blue-500/10 hover:text-blue-700"
                value="title"
              >
                Job Title
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-3 text-base font-medium w-full text-left transition-all duration-200 hover:bg-blue-500/10 hover:text-blue-700"
                value="aboutRole"
              >
                About this role
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-3 text-base font-medium w-full text-left transition-all duration-200 hover:bg-blue-500/10 hover:text-blue-700"
                value="qualification"
              >
                Skills & Qualification
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-3 text-base font-medium w-full text-left transition-all duration-200 hover:bg-blue-500/10 hover:text-blue-700"
                value="responsibility"
              >
                Responsibility
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-3 text-base font-medium w-full text-left transition-all duration-200 hover:bg-blue-500/10 hover:text-blue-700"
                value="attachments"
              >
                Attachments
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-3 text-base font-medium w-full text-left transition-all duration-200 hover:bg-blue-500/10 hover:text-blue-700"
                value="others"
              >
                Others
              </TabsTrigger>
            </TabsList>
            <TabsContent value="title" className="flex-1 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-inner min-h-[400px]">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Job Title & Basic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">Add Job Title *</Label>
                  <Input
                    type="text"
                    id="title"
                    placeholder="Enter Position"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobType" className="text-sm font-medium text-gray-700">Job Type *</Label>
                  <Select
                    onValueChange={(value) => handleChange("jobType", value)}
                    value={formData.jobType}
                  >
                    <SelectTrigger id="jobType" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                      <SelectValue placeholder="Select Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Time">Full Time</SelectItem>
                      <SelectItem value="Part Time">Part Time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workMode" className="text-sm font-medium text-gray-700">Work Mode *</Label>
                  <Select
                    onValueChange={(value) => handleChange("workMode", value)}
                    value={formData.workMode}
                  >
                    <SelectTrigger id="workMode" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                      <SelectValue placeholder="Select Work Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="On-Site">On-Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobLocation" className="text-sm font-medium text-gray-700">Job Location *</Label>
                  <Input
                    type="text"
                    id="jobLocation"
                    placeholder="e.g., New York, Remote"
                    value={formData.jobLocation}
                    onChange={(e) => handleChange("jobLocation", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-700">Experience *</Label>
                  <Select
                    onValueChange={(value) => handleChange("experience", value)}
                    value={formData.experience}
                  >
                    <SelectTrigger id="experience" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                      <SelectValue placeholder="e.g., 2-3 years, Entry Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshers">Freshers</SelectItem>
                      <SelectItem value="0-1 Years">0-1 Years</SelectItem>
                      <SelectItem value="1-3 Years">1-3 Years</SelectItem>
                      <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                      <SelectItem value="5+ Years">5+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company *</Label>
                  <Select
                    onValueChange={(value) => handleChange("company", value)}
                    value={formData.company}
                  >
                    <SelectTrigger id="company" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCompanies.map(company => (
                        <SelectItem key={company._id} value={company._id}>{company.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                  Continue
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="aboutRole" className="flex-1 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-inner min-h-[400px]">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">About This Role</h2>
              <div className="space-y-2 mb-6">
                <Label htmlFor="aboutRole" className="text-sm font-medium text-gray-700">About Role *</Label>
                <Textarea
                  id="aboutRole"
                  placeholder="Provide a detailed description of the job role..."
                  value={formData.aboutRole}
                  onChange={(e) => handleChange("aboutRole", e.target.value)}
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="flex justify-between mt-8">
                <Button onClick={() => setActiveTab("title")} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                  Previous
                </Button>
                <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                  Continue
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="qualification" className="flex-1 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-inner min-h-[400px]">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Skills & Qualification</h2>
              <div className="space-y-2 mb-6">
                <Label htmlFor="educationalQualification" className="text-sm font-medium text-gray-700">Educational Qualification *</Label>
                <Textarea
                  id="educationalQualification"
                  placeholder="e.g., Bachelor's degree in Computer Science or related field..."
                  value={formData.educationalQualification}
                  onChange={(e) => handleChange("educationalQualification", e.target.value)}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="space-y-2 mb-6">
                <Label htmlFor="skills" className="text-sm font-medium text-gray-700">Skills *</Label>
                <Textarea
                  id="skills"
                  placeholder="e.g., JavaScript, React, Node.js, AWS..."
                  value={formData.skills}
                  onChange={(e) => handleChange("skills", e.target.value)}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="flex justify-between mt-8">
                <Button onClick={() => setActiveTab("aboutRole")} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                  Previous
                </Button>
                <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                  Continue
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="responsibility" className="flex-1 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-inner min-h-[400px]">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Responsibility</h2>
              <div className="space-y-2 mb-6">
                <Label htmlFor="responsibility" className="text-sm font-medium text-gray-700">Responsibility *</Label>
                <Textarea
                  id="responsibility"
                  placeholder="List key responsibilities for this role..."
                  value={formData.responsibility}
                  onChange={(e) => handleChange("responsibility", e.target.value)}
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="flex justify-between mt-8">
                <Button onClick={() => setActiveTab("qualification")} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                  Previous
                </Button>
                <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                  Continue
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="flex-1 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-inner min-h-[400px]">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Attachments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="attachmentsJobDescription" className="text-sm font-medium text-gray-700">Job Description Document (Optional)</Label>
                  <Input
                    type="file"
                    id="attachmentsJobDescription"
                    onChange={(e) => handleFileChange("attachmentsJobDescription", e)}
                    className="w-full px-3 border border-gray-300 rounded-md file:mr-4 file:py-0 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                  />
                  {formData.attachmentsJobDescription && (
                    <p className="text-sm text-gray-500 mt-1">File: {formData.attachmentsJobDescription.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachmentsAboutCompany" className="text-sm font-medium text-gray-700">About Company Document (Optional)</Label>
                  <Input
                    type="file"
                    id="attachmentsAboutCompany"
                    onChange={(e) => handleFileChange("attachmentsAboutCompany", e)}
                    className="w-full px-3 border border-gray-300 rounded-md file:mr-4 file:py-0 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                  />
                  {formData.attachmentsAboutCompany && (
                    <p className="text-sm text-gray-500 mt-1">File: {formData.attachmentsAboutCompany.name}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <Button onClick={() => setActiveTab("responsibility")} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                  Previous
                </Button>
                <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                  Continue
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="others" className="flex-1 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-inner min-h-[400px]">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Other Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-sm font-medium text-gray-700">Salary (Optional)</Label>
                  <Input
                    type="text"
                    id="salary"
                    placeholder="e.g., $50,000 - $70,000 per year or Negotiable"
                    value={formData.salary}
                    onChange={(e) => handleChange("salary", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recruiterName" className="text-sm font-medium text-gray-700">Recruiter Name (Optional)</Label>
                  <Input
                    type="text"
                    id="recruiterName"
                    placeholder="Enter Recruiter Name"
                    value={formData.recruiterName}
                    onChange={(e) => handleChange("recruiterName", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email (Optional)</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter Contact Email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perksAndBenefits" className="text-sm font-medium text-gray-700">Perks & Benefits *</Label>
                  <Textarea
                    id="perksAndBenefits"
                    placeholder="List perks and benefits, e.g., Health Insurance, Paid Time Off... (Required)"
                    value={formData.perksAndBenefits}
                    onChange={(e) => handleChange("perksAndBenefits", e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => handleChange("expiryDate", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <Button onClick={() => setActiveTab("attachments")} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                  Previous
                </Button>
                <Button 
                  onClick={handlePostJob}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : ""}
                  Post Job
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default JobPost;
