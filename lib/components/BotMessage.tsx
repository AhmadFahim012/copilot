import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageType } from "@lib/types";
import BotIcon from "../assets/BotIcon";
import { useConfigData } from "@lib/contexts/ConfigData";
import { text } from "stream/consumers";

interface CompProps {
  message: MessageType;
  textDirection: "rtl" | "ltr";
  language: any;
  onYes: () => void;
  onNo: () => void;
}

export function BotMessage({
  message,
  textDirection,
  language,
  onYes,
  onNo,
}: CompProps) {
  const { darkMode } = useConfigData();

  const textAr = "هل تريد مني أن أساعدك ؟";
  const textEn = "Do you want me to assist you further more?";
  const endText =
    language === "ar"
      ? "هل تريد مني أن أساعدك ؟"
      : "Do you want me to assist you further more?";

  const assistanceMessageEn =
    "For more assistance, \nPlease visit the link:  \nhttps://ntdp.gov.sa/contact-us\nor contact NTDP Service Center at: 920014292.";
  const assistanceMessageAr =
    "للمساعدة، يمكنكم زيارة الرابط \nhttps://ntdp.gov.sa/contact-us\nأو التواصل مع مركز رعاية المستفيدين على الرقم: 920014292";

  const isAssistanceMessage =
    message.message === assistanceMessageEn ||
    message.message === assistanceMessageAr;

  const initialFormattedMessage =
    message &&
    message.message
      .replace(/(?:\\n|\n)/g, "  \n") // Convert newlines to Markdown line breaks
      .replace(/['"]+/g, ""); // Remove all quotes

  const formattedMessage = initialFormattedMessage.replace(
    /\\(.*?)\\/g,
    "**$1**"
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-end">
        <div
          className={`w-[40px] h-[40px] flex-shrink-0 flex items-center justify-center ${
            darkMode ? " " : "bg-bot-light"
          } rounded-full`}
          style={{
            background:
              "linear-gradient(247deg, rgba(225, 0, 29, 0.4) 18.85%, rgb(25, 38, 86) 60.13%), rgb(25, 38, 87)",
          }}
        >
          <BotIcon className="w-5 h-5" />
        </div>
        <span
          dir="auto"
          className={`flex ${
            textDirection === "rtl" ? "mr-3" : "ml-3"
          }  h-auto ${
            darkMode ? "bg-chat-bot-dark-bg" : "bg-chat-bot-light-bg"
          } text-sm font-normal rounded-xl max-w-[80%] p-2.5 px-4 items-center`}
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) =>
                isAssistanceMessage ? (
                  <span
                    onClick={() =>
                      window.open(
                        "https://portal-dev.ntdp-sa.com/contact-us",
                        "_blank"
                      )
                    }
                    className={`cursor-pointer ${
                      darkMode ? "text-[#60A5FA]" : "text-[#2563EB]"
                    } underline`}
                  >
                    {textDirection === "rtl" ? "انقر هنا" : "Click Here"}
                  </span>
                ) : (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={darkMode ? "text-[#60A5FA]" : "text-[#2563EB]"}
                  />
                ),
            }}
            className={`max-w-full  font-arabic-regular font-medium text-sm prose ${
              darkMode ? "text-chat-bot-dark-text" : "text-chat-bot-light-text"
            } prose-p:whitespace-pre-wrap prose-a:break-all text-sm leading-normal break-words [word-break:break-word]`}
          >
            {formattedMessage}
          </Markdown>
        </span>
      </div>
      {endText === message.message && (
        <div
          className={`flex mt-3 ${
            language === "ar" ? "mr-[52px]" : "ml-[52px]"
          }`}
        >
          <button
            onClick={onYes}
            className={`${
              darkMode
                ? "bg-transparent  text-sm font-arabic-regular font-medium hover:bg-[#192656] hover:text-[#fff] "
                : "bg-transparent"
            }  ${
              language === "ar" ? "mr-3" : "ml-3"
            } border border-[#464646]  rounded-full py-[6px] px-3  text-[#464646]`}
          >
            {language === "ar" ? "نعم" : "Yes"}
          </button>
          <button
            onClick={onNo}
            className={`${
              darkMode
                ? "bg-transparent  text-sm font-arabic-regular font-medium hover:bg-[#192656] transition-all duration-200 hover:text-[#fff]"
                : "bg-transparent hover:bg-[#192656]"
            }  ${
              language === "ar" ? "mr-3" : "ml-3"
            } border border-[#464646]  rounded-full py-[6px] px-3 text-[#464646]`}
          >
            {language === "ar" ? "لا" : "No"}
          </button>
        </div>
      )}
    </div>
  );
}
