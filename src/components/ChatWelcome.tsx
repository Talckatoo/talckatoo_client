import { useContext } from "react";
import { UserContext } from "../context/user-context";
import Button from "../UI/Button";
import { Navigate, useNavigate } from "react-router-dom";

export default function ChatWelcome() {
  const { isDarkMode } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <div className="h-full">
      <div className="flex justify-center items-center h-full ">
        <div className="flex flex-col justify-center items-center">
          <img
            className="m-auto"
            src="/assets/img/Chatting.svg"
            alt="Bird"
            width="800"
            height="603"
          />
          <Button
            type="button"
            onClick={() => navigate("/random?join=true")}
            className="bg-secondary-500 hover:bg-primary-600 text-white font-bold py-2 px-8 rounded-xl"
          >
            Join Random Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
