import React, { FC } from "react";
import { IoPersonSharp, IoSearch } from "react-icons/io5";

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
  const handleOnChange = () => {};
  return (
    <div className="flex items-center w-[90%] max-md:hidden">
      <IoSearch className="relative left-[2rem] max-md:left-0" size={24} />
      {/* <img src="./assets/img/search.png" className="relative left-[2rem] max-md:left-0" /> */}
      <form className="w-[70%]">
        <label htmlFor={name}>{label}</label>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          id={id}
          onChange={handleOnChange}
          className={`rounded-[10px] h-[41px] mb-0 bg-[#F5F5F5] pl-[2.5rem] ${
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
