import React, { FC, ChangeEvent } from "react";

interface InputProps {
  disabled?: boolean;
  label: string;
  type: string;
  name: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

const Input: FC<InputProps> = ({
  disabled=false,
  label,
  type,
  name,
  placeholder,
  value,
  error,
  className,
  onChange,
}) => {
  return (
    <div className="mb-4 xl:mb-6 w-full">
      <label
        htmlFor={name}
        className="block text-[14px] font-medium  mb-4 text-[#606060]"
      >
        {label}
      </label>
      <input
        disabled={disabled}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`  p-3 w-full  border-2 text-black relative text-[16px] focus:outline-none outline-none ${
          error ? "border-red-500" : ""
        } ${className}`}
      />
      {error && (
        <p className="mt-2 text-[16px] md:text-[18px] text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
