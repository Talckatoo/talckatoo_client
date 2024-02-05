import { useContext } from "react";
import { UserContext } from "../context/user-context";
import { useTranslation } from 'react-i18next';


export default function ChatWelcome() {
  const { t } = useTranslation();
  const {  isDarkMode } = useContext(UserContext);
  return (
    <div className="h-full">
        <div className='flex justify-center items-center h-full '>
          <div className="flex flex-col justify-center items-center">
          <img className="m-auto" src="/assets/img/Chatting.svg" alt="Bird" width="800" height="603"/>
          <p className="text-center max-md:px-4  max-w-[768px] text-black">{t('chatWelcome')}</p>
          </div>
        </div>
    </div>
  )
}
