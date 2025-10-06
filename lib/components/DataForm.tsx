import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa6";

interface compProps {
  lang: any;
  onClose: () => void;
  rating: number;
}

export const DataForm: React.FC<compProps> = ({ lang, onClose, rating }) => {
  const [fullname, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [loader, setLoader] = useState(false);

  const namePlaceholder = lang === "ar" ? "اسمك الكامل؟" : "Your Full Name?";
  const emailPlaceholder =
    lang === "ar" ? "بريدك الإلكتروني؟" : "Email Address?";
  const commentPlaceholder =
    lang === "ar" ? "تعليقاتك عن خدمتنا؟" : "Comments About our Service?";
  const btnText = lang === "ar" ? "إرسال" : "Submit";

  const submitFormDataToGoogleSheet = async (formData: any) => {};

  const handleOnSubmit = () => {
    // Check if any of the required fields are empty
    if (!fullname || !email || !comment) return;

    // Prepare the payload object
    const payload = {
      name: fullname,
      email: email,
      comments: comment,
      rating: rating,
    };

    setLoader(true);
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
      .then((response) => response.json()) // Parse the response to JSON
      .then((data) => {
        console.log("Success:", data); // Handle successful response
        setLoader(true);
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error); // Handle error if request fails
        setLoader(true);
      });
  };

  return (
    <div className="grid gap-3 w-[94%]  grid-cols-1 mt-5">
      {/* <p className={`text-[#fff] Bold text-[15px]`}>{heading}</p> */}
      <input
        placeholder={namePlaceholder}
        onChange={(e) => setFullName(e.target.value)}
        value={fullname}
        className={`rounded-full   text-xs font-arabic-regular col-span-1 px-3 py-2 text-[#464646] border  border-[#D7D7D7] outline-none hover:border-gray-400 focus:border-gray-400 transition-all duration-200 focus:ring-0 focus:outline-none`}
      />
      <input
        placeholder={emailPlaceholder}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className={`rounded-full   text-xs font-arabic-regular col-span-1 px-3 py-2 text-[#464646] border  border-[#D7D7D7] outline-none hover:border-gray-400 focus:border-gray-400 transition-all duration-200 focus:ring-0 focus:outline-none`}
      />
      <input
        placeholder={commentPlaceholder}
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        className={`rounded-full  text-xs font-arabic-regular  col-span-1 px-3 py-2 text-[#464646] border  border-[#D7D7D7]  outline-none hover:border-gray-400 focus:border-gray-400 transition-all duration-200 focus:ring-0 focus:outline-none`}
      />
      <button
        disabled={loader}
        onClick={handleOnSubmit}
        className={`mb-5 col-span-1 bg-[#192656] font-arabic-medium hover:bg-[#0e1736] transition-all duration-200 flex items-center justify-center   text-xs font-normal  rounded-full py-2 text-[#fff]`}
        // style={{
        //     background: 'linear-gradient(76.01deg, #4DC7C4 1.87%, #00BBDF 97.73%)'

        // }}
      >
        {!loader ? btnText : <FaSpinner className="size-6 animate-spin" />}
      </button>
    </div>
  );
};
