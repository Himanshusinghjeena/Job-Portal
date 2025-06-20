import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const JobsRouteWrapper = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "Recruiter") {
      navigate("/");
    }
  }, [user, navigate]);

  return <>{children}</>;
};

export default JobsRouteWrapper;
