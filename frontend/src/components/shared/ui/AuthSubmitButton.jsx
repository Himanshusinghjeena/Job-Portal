import React from "react";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";

const AuthSubmitButton = ({ loading, children }) => {
  return (
    <Button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer my-4 text-lg"
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default AuthSubmitButton; 