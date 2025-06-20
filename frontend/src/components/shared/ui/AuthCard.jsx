import React from "react";
import { Card, CardContent, CardHeader } from "../../ui/card";

const AuthCard = ({ title, description, children }) => {
  return (
    <Card className="w-full max-w-xl shadow-lg rounded-2xl">
      <CardHeader>
        <h2 className="text-3xl font-bold text-center">{title}</h2>
        <p className="text-center text-sm text-gray-500 mt-2">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AuthCard; 