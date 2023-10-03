import React, { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/user-context";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../util/url.ts";

interface ContactedUser {
  _id: string;
  userName: string;
  profileImage: ProfileImage;
  conversation: Conversation;
  language: string;
}

interface Conversation {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileImage {
  public_id?: string;
  url?: string;
}

const FetchLatestMessages: React.FC<{
  u: ContactedUser;
}> = ({ u }) => {
  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );
  const [latestMessage, setLatestMessage] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (user && u._id) {
          const { data } = await axios.get(
            `${BASE_URL}/api/v1/users/${user._id}/conversations/${u.conversation._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const messages = data.conversation.messages;
          const lastMess = messages[messages.length - 1];
          let truncateText: string = "";
          if (lastMess && lastMess.message) {
            truncateText = lastMess.message.substring(0, 20);
            if (lastMess.message.length > 20) {
              truncateText = truncateText + "...";
            }
          }
          if (truncateText) {
            setLatestMessage(truncateText);
          }
        }
      } catch (err) {
        toast.error("Error fetching messages, please try again");
      }
    };
    getMessages();
  }, []);

  return <div className="text-sm">{latestMessage}</div>;
};

export default FetchLatestMessages;
