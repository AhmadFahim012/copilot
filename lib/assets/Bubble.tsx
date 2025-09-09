import React from "react";

const HumanBubble: React.FC<React.SVGAttributes<SVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="11"
    viewBox="0 0 15 11"
    fill="none"
  >
    <circle cx="4.5" cy="4.5" r="4.5" fill="#192656" />
    <circle cx="13" cy="9" r="2" fill="#192656" />
  </svg>
);

export default HumanBubble;
