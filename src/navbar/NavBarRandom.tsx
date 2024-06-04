import { useContext, useRef } from "react";
import { UserContext } from "../context/user-context";
import { useAppSelector } from "../redux/hooks";
import { PiVideoCameraThin } from "react-icons/pi";
import { BiLogOut } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const NavBarRandom = ({ leaveRandomChat }) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useContext(UserContext);

  const handleLeaveRandomChat = () => {
    leaveRandomChat();
  };

  const handleRandomVideoCall = () => {};

  return (
    <nav className={`${isDarkMode ? "bg-[#181818]" : ""} `}>
      <div className="flex items-center justify-between p-1">
        <div>
          <div className="flex ">
            {user && (
              <>
                <div
                  className="flex justify-center items-center gap-2 p-2 cursor-pointer"
                  onClick={handleLeaveRandomChat}
                >
                  <BiLogOut color="red" size={28} />
                  <span className="text-[#ff1818e9] font-semibold">
                  {t("Leave Chat")}

                  </span>
                </div>

              
              </>
            )}
          </div>
        </div>

        <div className="m-2">
          <button className={`${ isDarkMode ? "text-white" : "text-black"}`} onClick={handleRandomVideoCall}>
            <PiVideoCameraThin size={34} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBarRandom;
