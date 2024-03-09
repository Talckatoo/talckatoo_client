import React, { useContext } from "react";
import { UserContext } from "../../context/user-context";
import { PiChatTextFill } from "react-icons/pi";
import { IoPersonSharp } from "react-icons/io5";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiSettings5Fill } from "react-icons/ri";
import { useAppSelector } from "../../redux/hooks";

const LeftSideBar = ({
  showSetting,
  showRequest,
  showRandom,
  setShowRequest = ()=>{},
  setButtonSelected = ()=>{},
}: {
  showSetting?: boolean;
  showRequest: boolean;
  showRandom: boolean;
  setShowRequest?: (showRequest: boolean) => void;
  setButtonSelected?: (buttonSelected: string)=>void;

}) => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(UserContext);
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation()
  const {pathname} = location;
  const handleSettingClick = () => {
    navigate("/profile");
  };
  return (
    <div
      className={`w-[80px] min-w-[80px]  grid grid-cols-1 gap-1 content-between h-full p-1 mb-[2rem] ${
        isDarkMode
          ? "border-r border-[#5D5DFF] border-opacity-20"
          : "border-r pt-5 border-opacity-20"
      }`}
    >
      <div className="flex flex-col  gap-3 w-full">
        <div
          className={`${isDarkMode ? "bg-[#E9E9EF]" : "bg-secondary-500 "}${
            showRequest || showRandom || showSetting
              ? `bg-white border-[1px]  hover:bg-gray-200 hover:border-gray-200 ${
                  isDarkMode ? "border-white" : "border-black"
                }`
              : ` border-[1px] border-secondary-500 hover:bg-black ${
                  isDarkMode ? "bg-[#E9E9EF]" : "bg-secondary-500"
                }`
          } mx-2 rounded-[12px]  flex items-center justify-center flex-col
              transition duration-300 ease-in-out 
            `}
            onClick={(pathname === "/chat") ? () => setShowRequest(!showRequest) : ()=>setButtonSelected("chats")}
            >
          <PiChatTextFill
            className={`${
              showRequest || showRandom || showSetting
                ? `${isDarkMode ? "text-white " : "text-secondary-500"}`
                : `${isDarkMode ? "text-black" : "text-white"}`
            } z-4 object-contain py-1 w-[29px] text-[32px]`}
          />
        </div>
        <div
          className={`${isDarkMode ? "bg-primary-500" : "bg-secondary-500 "}${
            !showRequest
              ? `bg-white border-[1px]  hover:bg-gray-200 hover:border-gray-200 ${
                  isDarkMode ? "border-white" : "border-black"
                }`
              : `bg-secondary-500 border-[1px]  hover:bg-black ${
                  isDarkMode ? "bg-[#E9E9EF]" : "border-secondary-500"
                }`
          } mx-2 rounded-[12px]  flex items-center justify-center flex-col
              transition duration-300 ease-in-out 
            `}
            onClick={(pathname === "/chat") ? () => setShowRequest(!showRequest) : ()=>setButtonSelected("friends")}
        >
          <IoPersonSharp
            className={`${
              !showRequest
                ? `${isDarkMode ? "text-white " : "text-secondary-500"}`
                : `${isDarkMode ? "text-black" : "text-white"}`
            } z-4 object-contain py-1 w-[29px] text-[32px]`}
          />
        </div>
        {/* random chat icons */}
        <Link to="/random">
          <div
            className={`${isDarkMode ? "bg-[#E9E9EF]" : "bg-secondary-500 "}${
              !showRandom
                ? `bg-white border-[1px]  hover:bg-gray-200 hover:border-gray-200 ${
                    isDarkMode ? "border-white" : "border-black"
                  }`
                : `bg-secondary-500 border-[1px]  hover:bg-black ${
                    isDarkMode ? "bg-[#E9E9EF]" : "border-secondary-500"
                  }`
            } mx-2 rounded-[12px]  flex items-center justify-center flex-col
      transition duration-300 ease-in-out 
    `}
          >
            <GiPerspectiveDiceSixFacesRandom
              className={`${
                !showRandom
                  ? `${isDarkMode ? "text-white" : "text-secondary-500"}`
                  : `${isDarkMode ? "text-black" : "text-white"}`
              } z-4 object-contain py-1 w-[29px] text-[32px]`}
            />
          </div>
        </Link>
      </div>
      <div className="flex flex-col  gap-3 w-full">
        <div
          className={`${
            isDarkMode ? "bg-[#E9E9EF]" : "bg-secondary-500"
          } mx-2 rounded-[12px]  flex items-center justify-center flex-col`}
          onClick={handleSettingClick}
        >
          <RiSettings5Fill
            className={`z-4 object-contain py-1 w-[29px] text-[32px] ${
              isDarkMode ? "text-[#25282C]" : "text-white"
            } `}
          />
        </div>
        <div className="mx-2 pb-2 mb-[1rem] flex items-center justify-center flex-col rounded-full overflow-hidden">
          <img
            src={user?.profileImage?.url || "/assets/icons/user.png"}
            // src={`${user?.profileImage?.url}`}
            className="h-14 w-14 object-cover rounded-full"
            alt="Profile-picture"
          />
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
