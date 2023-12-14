import React, { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/user-context";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../util/url.ts";

const FetchLatestMessages: React.FC<{
  u;
}> = ({ u }) => {
  let truncateText: string = "";
  if (u) {
    truncateText = u.substring(0, 20);
    if (u.length > 20) {
      truncateText = truncateText + "...";
    }
  }

  return <div className="text-sm">{truncateText}</div>;
};

export default FetchLatestMessages;
