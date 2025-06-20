import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";

import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TrustedSection from "./TrustedSection";
import Testimonial from "./Testimonial";
import Loader from "./shared/Loader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "Recruiter") {
      navigate("/admin/companies");
    } else {
      setLoading(false);
    }
  }, [user]);
  useGetAllJobs();

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Navbar />
          <HeroSection />
          <TrustedSection />
          <LatestJobs />
          <Testimonial />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Home;
