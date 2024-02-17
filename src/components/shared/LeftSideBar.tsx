import React, { useContext } from "react";
import { UserContext } from "../../context/user-context";
import { PiChatTextFill } from "react-icons/pi";
import { IoPersonSharp } from "react-icons/io5";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { RiSettings5Fill } from "react-icons/ri";
import { useAppSelector } from "../../redux/hooks";

const LeftSideBar = ({
  showSetting,
  showRequest,
  showRandom,
  setShowRequest,
}: {
  showSetting?: boolean;
  showRequest: boolean;
  showRandom: boolean;
  setShowRequest: (showRequest: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(UserContext);
  const { user } = useAppSelector((state) => state.auth);

  const handleSettingClick = () => {
    navigate("/profile");
  };
  return (
    <div className="w-[80px] min-w-[80px] border-r pt-5 border-opacity-20 grid grid-cols-1 gap-1 content-between h-full p-1 mb-[2rem]">
      <div className="flex flex-col  gap-3 w-full">
        <div
          className={`${isDarkMode ? "bg-primary-500" : "bg-secondary-500 "}${
            showRequest || showRandom || showSetting
              ? "bg-white border-[1px] border-black hover:bg-gray-200 hover:border-gray-200"
              : "bg-secondary-500 border-[1px] border-secondary-500 hover:bg-black"
          } mx-2 rounded-[12px]  flex items-center justify-center flex-col
              transition duration-300 ease-in-out 
            `}
          onClick={() => setShowRequest(!showRequest)}
        >
          <PiChatTextFill
            className={`${
              showRequest || showRandom || showSetting
                ? "text-secondary-500"
                : "text-white"
            } z-4 object-contain py-1 w-[29px] text-[32px]`}
          />
        </div>
        <div
          className={`${isDarkMode ? "bg-primary-500" : "bg-secondary-500 "}${
            !showRequest
              ? "bg-white border-[1px] border-black hover:bg-gray-200 hover:border-gray-200"
              : "bg-secondary-500 border-[1px] border-secondary-500 hover:bg-black"
          } mx-2 rounded-[12px]  flex items-center justify-center flex-col
              transition duration-300 ease-in-out 
            `}
          onClick={() => setShowRequest(!showRequest)}
        >
          <IoPersonSharp
            className={`${
              !showRequest ? "text-secondary-500" : "text-white"
            } z-4 object-contain py-1 w-[29px] text-[32px]`}
          />
        </div>
        {/* random chat icons */}
        <Link to="/random">
          <div
            className={`${isDarkMode ? "bg-primary-500" : "bg-secondary-500 "}${
              !showRandom
                ? "bg-white border-[1px] border-black hover:bg-gray-200 hover:border-gray-200"
                : "bg-secondary-500 border-[1px] border-secondary-500 hover:bg-black"
            } mx-2 rounded-[12px]  flex items-center justify-center flex-col
      transition duration-300 ease-in-out 
    `}
          >
            <GiPerspectiveDiceSixFacesRandom
              className={`${
                !showRandom ? "text-secondary-500" : "text-white"
              } z-4 object-contain py-1 w-[29px] text-[32px]`}
            />
          </div>
        </Link>
      </div>
      <div className="flex flex-col  gap-3 w-full">
        <div
          className={`
          ${isDarkMode ? "bg-primary-500" : "bg-secondary-500"} 
          ${!showSetting ? "bg-white border-[1px] border-black hover:bg-gray-200 hover:border-gray-200 ": "bg-secondary-500 border-[1px] border-secondary-500 hover:bg-black "}
           mx-2 rounded-[12px]  flex items-center justify-center flex-col transition duration-300 ease-in-out`}
          onClick={handleSettingClick}
        >
          <RiSettings5Fill
            className={`
            ${!showSetting ? "text-secondary-500" : "text-white"} 
            z-4 object-contain py-1 w-[29px] text-[32px]`
          }
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
