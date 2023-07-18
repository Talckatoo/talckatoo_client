import { useContext } from "react";
import { UserContext } from "../context/user-context";


export default function ChatWelcome() {

  const {  isDarkMode } = useContext(UserContext);
  return (
    <div>
        <div className='flex justify-center items-center h-screen'>
          <div>
          <img className="m-auto" src="https://img1.picmix.com/output/stamp/normal/8/2/0/1/1661028_d2ce9.gif" alt="Bird" width="80" height="80"/>
          <p className={`${isDarkMode ? "text-white" : "text-black"}`}>Welcome to TALCKATOO chat app!</p>
          </div>
        </div>
    </div>
  )
}
