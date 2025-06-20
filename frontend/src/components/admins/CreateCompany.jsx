import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateCompany = () => {
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState('');

    const continueToSetup = () => {
        if (!companyName.trim()) {
            toast.error("Company name is required");
            return;
        }
        // Navigate to company setup page passing companyName in state
        navigate('/admin/companies/setup', { state: { companyName } });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <div className="mb-6">
                        <h1 className="font-bold text-2xl sm:text-3xl text-gray-900 mb-2">Your Company Name</h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            What would you like to give your company name? You can't change this later.
                        </p>
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-2 block">Company Name</Label>
                        <Input
                            id="companyName"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="JobHunt, Microsoft, etc.."
                            value={companyName}
                            onChange={(e) => {
                                setCompanyName(e.target.value);
                            }}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
                        <Button variant="outline" onClick={() => navigate('/admin/companies')} className="w-full sm:w-auto px-6 py-2.5 text-lg transition-colors duration-200">Cancel</Button>
                        <Button onClick={continueToSetup} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-lg transition-colors duration-200">Continue</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCompany;
