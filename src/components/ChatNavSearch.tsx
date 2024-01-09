import React, { FC } from "react";

interface InputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  placeholder: string;
  id: string;
  error?: string;
  className?: string;
}

const ChatNavSearch: FC<InputProps> = ({
  label,
  type,
  name,
  value,
  id,
  error,
  placeholder,
  className,
}) => {
  return (
    <div className="flex items-center w-[50%]">
       <img src="./assets/img/search.png" className="relative left-[2rem]" />
       <form className="w-[70%]">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        id={id}
        className={`rounded-[10px] h-[41px] mb-0 bg-[#E9E9EF] pl-[2.5rem] ${
          error ? "border border-red-500" : ""
        } ${className}`}
      />
      {error && (
        <p className="max-md:text-[16px]  md:text-[18px] text-red-500">
          {" "}
          {error}
        </p>
      )}
    </form>
    </div>
   
  );
};

export default ChatNavSearch;
