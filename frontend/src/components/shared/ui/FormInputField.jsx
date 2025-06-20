import React, { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

const FormInputField = ({ label, id, type, placeholder, value, name, onChange, required = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      <Label htmlFor={id} className="my-2">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          required={required}
          className={isPassword ? "w-full pr-10" : "w-full"}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
              <MdOutlineVisibility />
            ) : (
              <MdOutlineVisibilityOff />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInputField; 