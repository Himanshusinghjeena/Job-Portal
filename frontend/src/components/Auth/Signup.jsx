import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/slice/authSlice";
import AuthCard from "../shared/ui/AuthCard";
import FormInputField from "../shared/ui/FormInputField";
import RoleSelector from "../shared/ui/RoleSelector";
import AuthSubmitButton from "../shared/ui/AuthSubmitButton";
import AuthNavLink from "../shared/ui/AuthNavLink";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
    file: "",
  });
  const { user, loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  // Validation regex patterns
  const fullNameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.com$/;
  const phoneRegex = /^[6789]\d{9}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate fullName
    if (!fullNameRegex.test(input.fullName)) {
      toast.error("Full Name must contain only letters and spaces.");
      return;
    }

    // Validate email
    if (!emailRegex.test(input.email)) {
      toast.error(
        "Email must start with a letter, contain one '@', and end with '.com'."
      );
      return;
    }

    // Validate phoneNumber
    if (!phoneRegex.test(input.phoneNumber)) {
      toast.error(
        "Phone Number must be exactly 10 digits, start with 6, 7, 8, or 9, and contain only numbers."
      );
      return;
    }

    // Validate password
    if (!passwordRegex.test(input.password)) {
      toast.error(
        "Password must be at least 6 characters and include one uppercase letter, one lowercase letter, and one special character."
      );
      return;
    }

    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <AuthCard
          title="Create an Account"
          description="Join as a Student or Recruiter"
        >
          <form onSubmit={submitHandler} className="space-y-5">
            <FormInputField
              label="Full Name"
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={input.fullName}
              name="fullName"
              onChange={changeEventHandler}
              required
            />

            <FormInputField
              label="Email"
              id="email"
              type="email"
              placeholder="john@example.com"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              required
            />

            <FormInputField
              label="Phone Number"
              id="phone"
              type="tel"
              placeholder="123-456-7890"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              required
            />

            <FormInputField
              label="Password"
              id="password"
              type="password"
              placeholder="********"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              required
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <RoleSelector
                selectedRole={input.role}
                onChange={changeEventHandler}
              />

              {/* Profile Upload */}
              <div className="sm:w-1/2">
                <Label htmlFor="profile">Profile Image</Label>
                <Input
                  id="profile"
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="mt-2"
                />
              </div>
            </div>

            <AuthSubmitButton loading={loading}>Sign Up</AuthSubmitButton>

            <AuthNavLink
              text="Already have an account?"
              linkText="Login"
              to="/login"
            />
          </form>
        </AuthCard>
      </div>
    </>
  );
};

export default Signup;
