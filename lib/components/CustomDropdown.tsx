import React, { useState } from "react";

interface CustomDropdownProps {
  options: string[]; // Array of options for the dropdown
  onOptionSelect: (option: string) => void; // Callback to handle option selection
  darkMode: boolean | any; // Boolean to determine dark or light mode styling
  language: "en" | "ar"; // Language code to render placeholder text
}

export function CustomDropdown({
  options,
  onOptionSelect,
  darkMode,
  language,
}: CustomDropdownProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onOptionSelect(option); // Pass selected value to parent component
    setIsMenuOpen(false); // Close the menu after selection
  };

  return (
    <div className="w-full">

      <div
        className={`ps-4 pe-12 py-2  md:text-base cursor-pointer w-full rounded-md ${
          darkMode
            ? "bg-body-dark text-chat-input-text-dark"
            : "bg-body-light text-chat-input-text-light"
        }`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {selectedOption
          ? selectedOption
          : language === "ar"
          ? "يرجى الاختيار من التالي"
          : "Please choose from the following"}
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          className={`w-full  rounded-md shadow-lg ${
            darkMode ? "bg-body-dark" : "bg-body-light"
          }`}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={`px-4 py-2 cursor-pointer text-base ${
                darkMode
                  ? "hover:bg-gray-700 hover:text-white text-chat-input-text-dark"
                  : "hover:bg-gray-200 hover:text-black text-chat-input-text-light"
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
