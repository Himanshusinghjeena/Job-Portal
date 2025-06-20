import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/slice/authSlice";
import { resetSavedJobs } from "@/redux/slice/jobSlice";
import AuthCard from "../shared/ui/AuthCard";
import FormInputField from "../shared/ui/FormInputField";
import RoleSelector from "../shared/ui/RoleSelector";
import AuthSubmitButton from "../shared/ui/AuthSubmitButton";
import AuthNavLink from "../shared/ui/AuthNavLink";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const { user, loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      
      if (res.data.success) {
        dispatch(resetSavedJobs());
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
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
          title="Welcome Back"
          description="Login to your account"
        >
          <form onSubmit={submitHandler} className="space-y-5">
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
              label="Password"
              id="password"
              type="password"
              placeholder="********"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              required
            />

            <RoleSelector
              selectedRole={input.role}
              onChange={changeEventHandler}
            />

            <AuthSubmitButton loading={loading}>LogIn</AuthSubmitButton>

            <AuthNavLink
              text="Don't have an account?"
              linkText="Sign Up"
              to="/signup"
            />
          </form>
        </AuthCard>
      </div>
    </>
  );
};

export default Login;
