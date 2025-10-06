import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useChatToggle } from "@lib/hooks/useChatToggle";
import cn from "@lib/utils/cn";
import { HiOutlineXMark, HiArrowPath } from "react-icons/hi2";
import {
  FaMessage,
  FaPaperPlane,
  FaCirclePlus,
  FaCircleXmark,
  FaSpinner,
  FaLink,
  FaRegTrashCan,
  FaStar,
} from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import {
  HumanMessage,
  BotMessage,
  CustomDropdown,
  DataForm,
} from "@lib/components";
import { MessageType } from "@lib/types";
import { useConfigData } from "@lib/contexts/ConfigData";
import { useScrollToPercentage } from "@lib/hooks";
import BotIcon from "./assets/BotIcon";
import { LogoDark, LogoLight } from "./assets/Logo";
import * as Tooltip from "@radix-ui/react-tooltip";
import { MdAttachFile } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { FiUploadCloud } from "react-icons/fi";
import Loader from "./assets/Loader";

export function CopilotWidget() {
  const { isOpen, toggleChat } = useChatToggle(false);
  const { userProfile, chatPosition, language, chatPlaceholder, darkMode } =
    useConfigData();
  const defaultPosition = language === "ar" ? "right" : "left";
  const position = chatPosition || defaultPosition;
  const textDirection = language === "ar" ? "rtl" : "ltr";
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [lastMessage, setLastMessage] = useState<MessageType | null>(null);
  const scrollElementRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docLang, setDocLang] = useState<string>("en");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docId, setDocId] = useState<string>("");
  const [setScrollPosition] = useScrollToPercentage(scrollElementRef);
  const baseURL = import.meta.env.VITE_BASE_API_URL;
  const [qFlag, setQFlag] = useState<Boolean>(false);
  const [fFlag, setFFlag] = useState<Boolean>(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const modaltext =
    language === "ar"
      ? "هل تريد مني أن أساعدك ؟"
      : "Do you want me to assist you further more?";
  const yesText =
    language === "ar"
      ? "تابع! أنا سعيد بمساعدتك أكثر"
      : "Go ahead! I'm happy to assist you further";
  const noText =
    language === "ar"
      ? "للمساعدة، يمكنكم زيارة الرابط \n(link here)\nأو التواصل مع مركز رعاية المستفيدين على الرقم: 920014292"
      : "For more assistance, \nPlease visit the link:  \n(link here)\nor contact NTDP Service Center at: 920014292.";

  // const fileUploadPrompt = language === "ar"
  // ? (file ? "يرجى تحميل الملف." : "يرجى اختيار الملف.")
  // : (file ? "Please upload the file." : "Please select the file.");
  // const dragDropText =
  //   language === "ar"
  //     ? "اسحب وأفلت مستندك"
  //     : "Drag & drop or Choose PDF to upload";
  const dragDropText =
    language === "ar"
      ? { before: "اسحب وأفلت مستندك", highlight: "", after: "" }
      : {
          before: "Drag & drop or ",
          highlight: "Choose PDF",
          after: " to upload",
        };
  const dragDropText2 = language === "ar" ? "تصفح ملفك" : "Attachments (.pdf)";
  const fileUploadText =
    language === "ar"
      ? "تم تحميل ملفك، يمكنك طرح سؤالك"
      : "Your file has been uploaded, you can ask a question";

  // Set default values based on language
  const defaultInitialMessage =
    language === "ar"
      ? `حياك الله،
       أنا مساعدك الافتراضي من البرنامج الوطني لتنمية قطاع تقنية المعلومات مهمتي الإجابة عن استفسارك وتقديم الدعم اللازم.
يرجى الملاحظة أن هذه الخدمة تحت التجربة وتعتمد على تقنيات الذكاء الاصطناعي التوليدي،
يسعدنا دعمك في تقييم الإجابات لتساهم معنا في تطوير خدماتنا`
      : `Welcome, 
      I am your virtual assistant from NTDP. My mission is to answer your inquiries and provide the necessary support.
Please note that this service is under trial and relies on generative AI technologies. Your feedback is valuable to help improve our services.`;

  const defaultChatPlaceholder =
    language === "ar" ? "اكتب سؤالك..." : "Ask question...";

  const quesArray =
    language === "ar"
      ? [
          "لا تحقق الغرض مطلقاً",
          "لا تحقق الغرض",
          "محايد",
          "تحقق الغرض",
          "تحقق الغرض بشكل كامل",
        ]
      : [
          "Does not meet the purpose at all",
          "Does not meet the purpose",
          "Neutral",
          "Meets the purpose",
          "Fully meets the purpose",
        ];

  const thankuText =
    language === "ar" ? "شكراً لملاحظاتك!" : "Thanks for your feedback!";
  const thankuText123 =
    language === "ar"
      ? "شكراً لملاحظاتك! راح نحل المشكلة. فيه شيء ثاني تود تضيفه؟"
      : "Thanks for your feedback! We'll look into that. Anything else?";
  const questionHeading =
    language === "ar"
      ? "هل كانت الإجابة تحقق الغرض المطلوب؟\nيرجى التقييم من 1 إلى 5 حيث:"
      : "Did the answer meet the intended purpose? Please rate from 1 to 5, where:";

  const formHeading =
    language === "ar"
      ? "هلا! شكراً لتقديم التقييم، نحتاج منك تقديم بعض المعلومات الشخصية عشان نقدر نتواصل معك إذا لزم الأمر."
      : "Hi there! Thanks for providing  the feedback. Could you help us by providing your personal information so we can contact you if needed";

  const promtDlt =
    language === "ar"
      ? "لقد قمت بحذف الملف الذي قمت بتحميله، يمكنك الآن طرح الأسئلة على البوت."
      : "You have removed the file you uploaded. Now you can ask the bot questions.";

  const lastAnsPropmt =
    language === "ar"
      ? "برنامج تطوير التكنولوجيا الوطني هو برنامج وطني يساهم في تطوير النظام البيئي التكنولوجي في المملكة"
      : "NTDP is a national program that contributes to developing the technology ecosystem in the Kingdom";

  // Use configured values or fall back to defaults
  const initialMessageToUse = defaultInitialMessage;
  const chatPlaceholderToUse = chatPlaceholder || defaultChatPlaceholder;
  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const filteredMessages = messages.filter(
    (item) =>
      item.type === "bot" &&
      item.message !== defaultInitialMessage &&
      item.message !== noText &&
      item.message !== modaltext &&
      item.message !== yesText &&
      item.message !== fileUploadText &&
      item.message !== thankuText &&
      item.message !== thankuText123 &&
      item.message !== questionHeading &&
      item.message !== formHeading &&
      item.message !== promtDlt // Compare the actual message strings
  );

  const lastAnswer =
    filteredMessages.length > 0
      ? filteredMessages[filteredMessages.length - 1].message
      : lastAnsPropmt;

  const handleQues = async () => {
    await delay(2000);
    setQFlag(true);
    // setTimeout(() => {
    //   // setMessages([])
    //   setQFlag(true);
    //   setScrollPosition(0, 100);
    // }, 3000);
  };

  const handleQuesClick = (index: number) => {
    console.log("🚀 ~ handleQuesClick ~ index:", index);
    if (index === 4 || index === 5) {
      const filterMsg = messages.filter(
        (item) =>
          item.type === "bot" &&
          item.message !== formHeading &&
          item.message !== questionHeading
      );
      setMessages(filterMsg);
      const timeoutMessage: MessageType = {
        id: uuidv4(),
        message: thankuText,
        time: new Date().toISOString(),
        type: "bot",
      };
      setMessages((prevMessages: MessageType[]) => [
        ...prevMessages,
        timeoutMessage,
      ]);
      setQFlag(false);
      const payload = {
        rating: index,
      };
      fetch(
        "https://xbo1k7k40b.execute-api.us-east-1.amazonaws.com/dev/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // setLoader(true);
          // onClose();
        })
        .catch((error) => {
          console.error("Error:", error); // Handle error if request fails
          // setLoader(true);
        });
    } else {
      const timeoutMessage: MessageType = {
        id: uuidv4(),
        message: formHeading,
        time: new Date().toISOString(),
        type: "bot",
      };
      setMessages((prevMessages: MessageType[]) => [
        ...prevMessages,
        timeoutMessage,
      ]);
      setQFlag(false);
      setFFlag(true);
    }
  };

  const handleFormSubmit = () => {
    const filterMsg = messages.filter(
      (item) =>
        item.type === "bot" &&
        item.message !== formHeading &&
        item.message !== questionHeading
    );
    setMessages(filterMsg);
    const timeoutMessage: MessageType = {
      id: uuidv4(),
      message: thankuText123,
      time: new Date().toISOString(),
      type: "bot",
    };
    setMessages((prevMessages: MessageType[]) => [
      ...prevMessages,
      timeoutMessage,
    ]);
    setQFlag(false);
    setFFlag(false);
  };

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const timeoutMessage: MessageType = {
        id: uuidv4(),
        message: modaltext,
        time: new Date().toISOString(),
        type: "bot",
      };
      setMessages((prevMessages: MessageType[]) => [
        ...prevMessages,
        timeoutMessage,
      ]);
    }, 60000); // 20 seconds
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    resetTimeout();
  };

  const handleSend = () => {
    sendMessage();
    setQuery("");
    resetTimeout();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const firstMessage: MessageType = {
      id: uuidv4(),
      message: initialMessageToUse,
      time: new Date().toISOString(),
      type: "bot",
    };

    setMessages((prevMessages: MessageType[]) => [
      firstMessage,
      ...prevMessages,
    ]);
  }, []);

  const handleScroll = () => {
    if (scrollElementRef.current && scrollElementRef.current.scrollTop !== 0) {
      // Scroll only if not at the top
      scrollElementRef.current.scrollTo({
        top: scrollElementRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Prevent scroll if at the top
  useEffect(() => {
    if (scrollElementRef.current && scrollElementRef.current.scrollTop !== 0) {
      scrollElementRef.current.scrollTop += 150;
    }
  }, [messages]);

  // Trigger scroll on loading but skip if already at the top
  useEffect(() => {
    if (loading) {
      handleScroll();
    }
  }, [loading]);

  const sendMessage = async () => {
    if (!query) {
      return;
    }
    setLoading(true);
    // const filterMsg = messages.filter((item) => item.type === "bot" && item.message !== formHeading && item.message !== questionHeading)
    // setMessages(filterMsg)
    setQFlag(false);
    setFFlag(false);
    try {
      // Add the user message to the messages array
      const userMessage: MessageType = {
        id: uuidv4(),
        message: query,
        time: new Date().toISOString(),
        type: "human",
      };

      setMessages((prevMessages: MessageType[]) => [
        ...prevMessages,
        userMessage,
      ]);
      setLastMessage(userMessage); // Update lastMessage here
      setScrollPosition(0, 100);
      const response: any = await fetch(`${baseURL}/stream_chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: language === "ar" ? "FUU6rApxilEueYqT" : "sl2KXr73xtUBdp2n",
          // token:token,
          last_answer: lastAnswer,
          question: query,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // Process bot messages as they arrive in the stream
      let currentMessage: MessageType | null = null;
      if (response.status === 200) {
        setLoading(false);
      }
      const processBotStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const message = decoder.decode(value);

            if (currentMessage && currentMessage.type === "bot") {
              // If the current message is a bot message, append the new message to it
              currentMessage.message += message;
              setMessages((prevMessages: any) => [
                ...prevMessages.slice(0, -1),
                currentMessage,
              ]);
            } else {
              // Otherwise, treat it as a new message
              currentMessage = {
                id: uuidv4(),
                message: message,
                time: new Date().toISOString(),
                type: "bot",
              };
              setMessages((prevMessages: any) => [
                ...prevMessages,
                currentMessage,
              ]);
            }

            // Update lastMessage with the current message
            setLastMessage(currentMessage);
          }
        } catch (error) {
          console.error("Error processing bot stream:", error);
        }
      };

      // Start processing the bot stream
      processBotStream();
    } catch (error) {
      setLoading(false);
      console.error("Error sending message:", error);
    }
  };

  const clearConversation = async () => {
    setMessages([]);
    setDocId("");
    // setDocLang('')
    setFile(null);
    setQFlag(false);
    setFFlag(false);
    // try {

    //   const response = await fetch(`${baseURL}/clear_memory`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({}),
    //   });

    //   if (!response.ok) {
    //     throw new Error(`Error: ${response.statusText}`);
    //   }

    //   // Reset the conversation (clear messages)
    //   setMessages([]);
    // } catch (error) {
    //   console.error("Failed to clear conversation:", error);
    // } finally {

    // }
  };

  useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const handleNo = async () => {
    const filterMsg = messages.filter(
      (item) => !(item.type === "bot" && item.message === modaltext)
    );
    setMessages(filterMsg);
    const timeoutMessage: MessageType = {
      id: uuidv4(),
      message: noText,
      time: new Date().toISOString(),
      type: "bot",
    };
    setMessages((prevMessages: MessageType[]) => [
      ...prevMessages,
      timeoutMessage,
    ]);
    setQuery("");
    await delay(400);
    setScrollPosition(0, 100);
    await delay(2000);
    const timeoutMessage2: MessageType = {
      id: uuidv4(),
      message: questionHeading,
      time: new Date().toISOString(),
      type: "bot",
    };
    setMessages((prevMessages: MessageType[]) => [
      ...prevMessages,
      timeoutMessage2,
    ]);
    setQFlag(true);
    await delay(200);
    setScrollPosition(0, 100);
  };

  const handleYes = async () => {
    const filterMsg = messages.filter(
      (item) => !(item.type === "bot" && item.message === modaltext)
    );
    setMessages(filterMsg);
    const timeoutMessage: MessageType = {
      id: uuidv4(),
      message: yesText,
      time: new Date().toISOString(),
      type: "bot",
    };
    setMessages((prevMessages: MessageType[]) => [
      ...prevMessages,
      timeoutMessage,
    ]);
    setQuery("");
    await delay(400);
    setScrollPosition(0, 100);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      // setOpen(false)
      console.log("file upload");
    }
  };

  const handleFileUpload = async (e: any) => {
    e.stopPropagation();
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    setOpen(false);
    setScrollPosition(0, 100);
    const formData = new FormData();
    formData.append("files", file);
    formData.append("language", docLang);
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/upload_session_files`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed.");
      }

      const result = await response.json();
      if (result && result.temp_copilot_id) {
        setDocId(result && result.temp_copilot_id);
        const filuploadMsg: MessageType = {
          id: uuidv4(),
          message: fileUploadText,
          time: new Date().toISOString(),
          type: "bot",
        };
        setMessages(() => [filuploadMsg]);
        await delay(200);
        setScrollPosition(0, 100);
      }
    } catch (error: any) {
      console.error("File upload failed:", error);
    } finally {
      setFile(null); // Reset the file state
      setLoading(false);
    }
  };

  const handleLangSelect = (lang: string) => {
    setDocLang(lang);
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open file picker
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDocQuestion = async () => {
    if (!docId || !query) return;

    const userMessage: MessageType = {
      id: uuidv4(),
      message: query,
      time: new Date().toISOString(),
      type: "human",
    };

    setMessages((prevMessages: MessageType[]) => [
      ...prevMessages,
      userMessage,
    ]);
    setScrollPosition(0, 100);

    const formData = new URLSearchParams();
    formData.append("temp_copilot_id", docId);
    formData.append("question", query);
    formData.append("last_answer", lastAnswer?.trim() || " ");

    setQuery("");
    setLoading(true);

    try {
      const response = await fetch(`${baseURL}/session_stream_chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      setLoading(false);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      if (response.ok) {
        const data = await response.json();
        const docAnswr: MessageType = {
          id: uuidv4(),
          message: data,
          time: new Date().toISOString(),
          type: "bot",
        };
        setMessages((prevMessages: MessageType[]) => [
          ...prevMessages,
          docAnswr,
        ]);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error in handleDocQuestion:", error);
    }
  };

  const handleDeleteFile = async () => {
    const Msg: MessageType = {
      id: uuidv4(),
      message: promtDlt,
      time: new Date().toISOString(),
      type: "bot",
    };
    setMessages(() => [Msg]);
    setDocId("");
    await delay(200);
    setScrollPosition(0, 100);
  };

  const handleSubmit = async (): Promise<void> => {
    if (docId) {
      handleDocQuestion();
      return;
    } else {
      handleSend();
    }

    // if (file) {
    //   handleFileUpload()
    //   return
    // }
  };

  const handleDrop = (e: any) => {
    e.preventDefault(); // Prevent default behavior to allow the drop
    const droppedFile = e.dataTransfer.files[0]; // Get the dropped file
    if (droppedFile) {
      setFile(droppedFile); // Set the file directly
    }
  };

  const gradientAngle = textDirection === "rtl" ? "-200deg" : "200deg";
  return (
    <>
      <Tooltip.Provider>
        <div
          className={cn(
            `fixed bottom-[84px] ${
              position === "left" ? "left-[20px]" : "right-[20px]"
            } h-[600px] min-h-[80px] w-[380px] max-w-[90%] sm:max-w-[80vw] max-h-[76vh] shadow-custom rounded-[6px] overflow-hidden transition-opacity ease opacity-0 z-[999]`,
            isOpen
              ? "opacity-100 animate-in fade-in-10"
              : "hidden animate-out fade-out",
            darkMode ? "" : "bg-body-light"
          )}
          dir={textDirection}
        >
          <div
            className={`h-full relative shadow-custom ${
              darkMode ? "" : "bg-body-light"
            }`}
          >
            <div className="flex flex-col h-full w-full bg-[#fff]">
              <div
                className={`flex flex-col ${
                  darkMode ? "bg-header-dark" : "bg-header-light"
                } py-2 px-5`}
                style={{
                  background: `linear-gradient(${gradientAngle}, rgba(225,0,29,0.8) -20.15%, rgb(25,38,86) 30.13%), rgb(25,38,87)`,
                }}
              >
                <div className="h-10 flex justify-between items-center">
                  <div className="flex items-center">
                    {darkMode ? <LogoDark /> : <LogoLight />}
                  </div>
                  <div className="flex items-center">
                    <HiArrowPath
                      className={`w-5 h-5 cursor-pointer ml-2 ${
                        darkMode
                          ? "text-chat-icon-dark"
                          : "text-chat-icon-light"
                      }`}
                      onClick={clearConversation}
                    />
                    <HiOutlineXMark
                      className={`w-5 h-5 cursor-pointer ${
                        darkMode
                          ? "text-chat-icon-dark"
                          : "text-chat-icon-light"
                      }`}
                      onClick={toggleChat}
                    />
                    {docId && (
                      <FaRegTrashCan
                        className={`w-5 h-5 cursor-pointer ml-2 ${
                          darkMode
                            ? "text-chat-icon-dark"
                            : "text-chat-icon-light"
                        }`}
                        onClick={handleDeleteFile}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className={`grow overflow-hidden`}>
                <div
                  ref={scrollElementRef}
                  className="overflow-y-auto p-3 h-full bg-body-light"
                >
                  {messages && messages.length > 0 && (
                    <div className="space-y-4">
                      {messages.map((message, index) => {
                        if (message.type === "human") {
                          return (
                            <React.Fragment key={message.id}>
                              <HumanMessage
                                message={message}
                                textDirection={textDirection}
                                userProfile={userProfile}
                              />
                            </React.Fragment>
                          );
                        } else {
                          return (
                            <BotMessage
                              message={message}
                              key={message.id}
                              textDirection={textDirection}
                              language={language}
                              onYes={handleYes}
                              onNo={handleNo}
                            />
                          );
                        }
                      })}

                      {/* ✅ Loading Indicator Moved Outside */}
                      {loading && (
                        <div className="flex items-end">
                          <div
                            className={`w-[40px] h-[40px] flex-shrink-0 flex items-center justify-center rounded-full ${
                              darkMode ? "" : "bg-bot-light"
                            }`}
                            style={{
                              background:
                                "linear-gradient(233.54deg, #E1001D 3.58%, #192656 53.51%)",
                            }}
                          >
                            <BotIcon
                              className={`w-5 h-5 ${
                                darkMode ? "text-white" : ""
                              }`}
                            />
                          </div>
                          <div
                            className={`${
                              textDirection === "rtl" ? "mr-3" : "ml-3"
                            } bg-[#EDEDED] px-3 rounded-t-xl  rounded-br-xl `}
                          >
                            <Loader
                              // animationData={animationData}
                              // loop={true}
                              className="h-[40px] object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {!qFlag && !fFlag && messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center">
                        <FaMessage className="text-gray-300 mb-1 w-6 h-6" />
                        <p className="text-gray-300 text-sm">No Messages</p>
                      </div>
                    </div>
                  )}
                  {qFlag && (
                    <div
                      className={` ${
                        language === "ar" ? "mr-[52px]" : "ml-[52px]"
                      } mt-5 border border-gray-300 py-2 px-4  rounded-full flex items-center justify-between gap-2 w-[80%]`}
                    >
                      {/* <p className="text-[#464646]  text-[12px] font-normal bg-chat-bot-dark-bg p-2.5 px-4 rounded-xl mb-3">
                        {questionHeading}
                      </p> */}
                      <>
                        {[1, 2, 3, 4, 5].map((star, index) => (
                          <FaStar
                            key={star}
                            size={25}
                            className={`cursor-pointer transition-colors ${
                              (hover || rating) >= star
                                ? "text-[#FFCC00]"
                                : "text-[#C9C7BF]"
                            }`}
                            onClick={() => {
                              handleQuesClick(star);
                              setRating(star);
                            }}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                          />
                        ))}
                      </>
                    </div>
                  )}
                  {fFlag && (
                    <div
                      className={`${
                        language === "ar" ? "mr-[52px]" : "ml-[52px]"
                      }`}
                    >
                      <DataForm
                        lang={language}
                        onClose={handleFormSubmit}
                        rating={rating}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="px-3 rounded-[20px] border border-gray-400 bg-[#fff] m-5">
                <div className="flex w-full items-center bg-transparent">
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <div
                        onClick={() => setOpen(true)}
                        className="cursor-pointer self-center"
                      >
                        <MdAttachFile className="text-gray-700" />
                        {/* <img src={SelectIcon} alt="select" /> */}
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      align="start"
                      className="bg-[#000] text-[#fff]  text-[12px]"
                      // className="bg-gray-700 z text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      File Upload
                    </Tooltip.Content>
                  </Tooltip.Root>
                  <input
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    type="text"
                    disabled={loading}
                    required
                    className={`${textDirection === "rtl" ? "mr-2" : "ml-2"}
                  flex-1 py-2  md:text-xs bg-transparent outline-none text-xs ${
                    darkMode
                      ? "text-chat-input-text-light placeholder:text-chat-input-placeholder-light"
                      : "text-chat-input-text-dark placeholder:text-chat-input-placeholder-dark"
                  } ${textDirection === "rtl" ? "text-right" : "text-left"}`}
                    placeholder={chatPlaceholderToUse}
                  />
                  {!loading ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className={`${
                        darkMode
                          ? "text-gray-700"
                          : "text-chat-input-send-light"
                      }`}
                    >
                      <FaPaperPlane />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className={`animate-spin ${
                        darkMode
                          ? "text-chat-input-send-dark"
                          : "text-chat-input-send-light"
                      }`}
                    >
                      <FaSpinner />
                    </button>
                  )}
                </div>
              </div>
            </div>
            {open && (
              <div className="absolute inset-0  backdrop-blur-[8px] bg-[#41414133]  flex flex-col items-center justify-end">
                <div
                  onClick={() => handleFileSelect()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e)}
                  className={`w-[90%] mb-[60px] cursor-pointer py-2 pb-5 text-[#464646] bg-[#fff] flex flex-col justify-center items-center border border-[#A9A9A9] rounded-[10px]`}
                >
                  <div
                    className={`flex justify-end items-end min-w-full mb-1 ${
                      language === "ar" ? "ml-2" : "mr-6"
                    }`}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(false);
                      }}
                    >
                      <IoCloseOutline className={`text-[#464646]`} size={16} />
                    </div>
                  </div>
                  <FiUploadCloud size={25} />

                  {/* <img src={FileIcon} alt="fileIcon" className="mb-3" /> */}

                  {!file && (
                    <>
                      <p
                        className={`font-arabic-bold text-sm text-[#464646] ${
                          textDirection === "rtl" ? "text-right" : "text-left"
                        }`}
                      >
                        {dragDropText.before}
                        {dragDropText.highlight && (
                          <span className={`${darkMode ? "text-[#588999]" : "text-gradient"} font-bold`}>
                            {dragDropText.highlight}
                          </span>
                        )}
                        {dragDropText.after}
                      </p>
                      <p
                        className={` text-[14px] font-arabic-regular text-[#464646] ${
                          textDirection === "rtl" ? "text-right" : "text-left"
                        }`}
                      >
                        {language === "ar" ? (
                          <p className="text-[14px] font-arabic-regular ">
                            <span className="text-[#588999] font-arabic-regular">
                              أو
                            </span>{" "}
                            <span
                              className={`${
                                darkMode ? "text-[#fff]" : "text-gradient"
                              } `}
                            >
                              {dragDropText2}{" "}
                            </span>
                            <span className="text-[#588999] font-arabic-regular">
                              هنا.
                            </span>
                          </p>
                        ) : (
                          <>
                            {/* <span className="text-[#588999]">or</span>{" "} */}
                            {dragDropText2}{" "}
                            {/* <span className="text-[#588999]">here.</span> */}
                          </>
                        )}
                      </p>
                    </>
                  )}
                  {file?.name && (
                    <p
                      className={` text-p[#464646] font-arabic-regular text-[14px] ${
                        textDirection === "rtl" ? "text-right" : "text-left"
                      }`}
                    >
                      {file?.name}
                    </p>
                  )}

                  {file && (
                    <button
                      onClick={(e) => handleFileUpload(e)}
                      className={`px-5 py-1  rounded-full border-2 border-[#878B9D] bg-transparent text-[#464646] mt-3 hover:bg-[#878B9D]
                        }`}
                    >
                      {language === "ar" ? "تحميل" : "Upload"}
                    </button>
                  )}

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="application/pdf,.pdf"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={toggleChat}
          className={`fixed flex items-center justify-center rounded-full w-14 h-14 bottom-[20px] ${
            position === "left" ? "left-[20px]" : "right-[20px]"
          } shadow-custom `}
          style={{
            background:
              "linear-gradient(235deg, rgba(225, 0, 29, 0.4) 18.85%, rgb(25, 38, 86) 60.13%), rgb(25, 38, 87)",
          }}
        >
          <BotIcon className="w-7 h-7" />
        </button>
      </Tooltip.Provider>
    </>
  );
}
