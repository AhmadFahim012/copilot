import React from "react";
import { FaUser } from "react-icons/fa6";
import { MessageType} from "@lib/types";
import { useConfigData } from "@lib/contexts/ConfigData";


export function HumanMessage({ message, textDirection, userProfile }: { message: MessageType, textDirection: "rtl" | "ltr", userProfile?: string }) {
  const { darkMode } = useConfigData();
  
  return (
    <div className={`flex justify-end items-end`}>
      <span className={`me-1 ${
        darkMode 
          ? "text-body-light" 
          : "bg-chat-human-light-bg text-chat-human-light-text"
      }  h-auto text-sm font-normal rounded-xl p-2.5 px-4 items-end flex justify-end ${
        textDirection === "rtl" ? "text-right" : "text-left"
      }`} style={{
        background: 'linear-gradient(79.41deg, #192656 7.86%, #A2C0E6 97.29%)'

      }}>
        {message.message}
      </span>
      
      {userProfile && (
        <img src={userProfile} alt="User" className={`w-9 h-9 rounded-full ${textDirection === "rtl" ? "mr-3" : "ml-3"}`} />
      )}

    </div>
  );
}
