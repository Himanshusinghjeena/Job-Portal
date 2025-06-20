import React from "react";
import { Link } from "react-router-dom";

const AuthNavLink = ({ text, linkText, to }) => {
  return (
    <p className="text-center text-sm text-gray-500">
      {text}{" "}
      <Link to={to} className="text-blue-600 hover:underline">
        {linkText}
      </Link>
    </p>
  );
};

export default AuthNavLink; 