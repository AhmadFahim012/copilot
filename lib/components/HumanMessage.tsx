import React from "react";
import { FaUser } from "react-icons/fa6";
import { MessageType } from "@lib/types";
import { useConfigData } from "@lib/contexts/ConfigData";
import UserIcon from "@lib/assets/bubble.svg?url";
import HumanBubble from "@lib/assets/Bubble";

export function HumanMessage({
  message,
  textDirection,
  userProfile,
}: {
  message: MessageType;
  textDirection: "rtl" | "ltr";
  userProfile?: string;
}) {
  const { darkMode } = useConfigData();

  return (
    <div className={`flex justify-end items-end`}>
      <span
        className={`me-1 ${
          darkMode
            ? "text-body-light"
            : "bg-chat-human-light-bg text-chat-human-light-text"
        }  h-auto text-sm font-normal rounded-xl p-2.5 px-4 items-end flex justify-end ${
          textDirection === "rtl" ? "text-right" : "text-left"
        }`}
        style={{
          background: "#192656",
        }}
      >
        {message.message}
      </span>

      {/* {userProfile && (
        <img
          src={userProfile}
          alt="User"
          className={`w-9 h-9 rounded-full ${
            textDirection === "rtl" ? "mr-3" : "ml-3"
          }`}
        />
      )} */}
      {/* <img
        src={UserIcon}
        alt="User"
        className={`w-9 h-9 rounded-full ${
          textDirection === "rtl" ? "mr-3" : "ml-3"
        }`}
      /> */}
      <div className="w-[18px] h-[12px]">
        <HumanBubble />
      </div>
    </div>
  );
}
