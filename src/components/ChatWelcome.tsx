import { useContext } from "react";
import { UserContext } from "../context/user-context";


export default function ChatWelcome() {

  const {  isDarkMode } = useContext(UserContext);
  return (
    <div className="h-full">
        <div className='flex justify-center items-center h-full '>
          <div className="flex flex-col justify-center items-center">
          <img className="m-auto" src="/assets/img/Chatting.png" alt="Bird" width="800" height="603"/>
          <p className="text-center max-md:px-4  max-w-[768px] text-black">Seamlessly chat with individuals across language barriers. No more copy-pasting. Just real-time, in-chat translations.</p>
          </div>
        </div>
    </div>
  )
}
