/** @type {import('tailwindcss').Config} */
import { Config } from "tailwindcss";
import {
  white,
  transparent,
  black,
  rose,
  current,
  gray,
  yellow,
  slate,
  blue
} from "tailwindcss/colors";
const config: Config = {
  content: [
    "./src/**/*.{tsx,ts,html}",
    "./index.html",
    "./lib/**/*.{tsx,ts,html}",
  ],
  theme: {
    colors: {
      bot: {
        light: '#FEC108',
        dark: '#F78D69', // blue-600
      },
      header: {
        dark: '#1B3559',     // dark
        light: '#FEC108',    
      },
      body: {
        dark: '#020627',     // dark
        light: '#FFFFFF',    // white
      },
      chat: {
        human: {
          dark: {
            bg: '#5A99D7',    // background color in dark mode
            text: '#FFFFFF',   // text color in dark mode
          },
          light: {
            bg: '#5A99D7',    // background color in light mode
            text: '#FFFFFF',   // text color in light mode
          }
        },
        bot: {
          dark: {
            bg: '#EDEDED',   // background color in dark mode
            text: '#464646',  // text color in dark mode
          },
          light: {
            bg: '#EDEDED',   // background color in light mode
            text: '#464646', // text color in light mode
          }
        },
        input: {
          border: {
            dark: '#374151',   // gray-700
            light: '#EBEBEB',
          },
          text: {
            dark: '#FFFFFF',
            light: '#262626',  // gray-900
          },
          placeholder: {
            dark: '#9CA3AF',   // gray-400
            light: '#737376',  // gray-300
          },
          send: {
            light: '#FEC108',
            dark: '#F78D69', 
          }
        },
        icon: {
          dark: '#FFFFFF',
          light: '#202020',
        }
      },
      transparent,
      gray,
    },
    boxShadow:{
      'botMsg': "0px 2px 8px 0px rgba(35, 47, 53, 0.09)",
      'outer':'rgba(0, 0, 0, 0.15) 0px 2px 8px',
      'custom':'rgba(33, 33, 33, 0.12) 0px 16px 24px 2px, rgba(33, 33, 33, 0.08) 0px 6px 30px 5px, rgba(33, 33, 33, 0.04) 0px 6px 10px -5px'
    },
    backgroundImage:{
      "gradient": "linear-gradient(to right, #3C38C1, #4d64ff)"
    },
    fontFamily: {
      // Inter: ["Inter", "sans-serif"],
      // InterBold: ["InterBold", "sans-serif"],
      arabic: ['"DIN Next LT Arabic"', 'sans-serif'],
      'arabic-regular': ['"DIN Next LT Arabic"', 'sans-serif'],
      'arabic-medium': ['"DIN Next LT Arabic"', 'sans-serif'],
      'arabic-bold': ['"DIN Next LT Arabic"', 'sans-serif'],
      'arabic-light': ['"DIN Next LT Arabic"', 'sans-serif'],
      'arabic-black': ['"DIN Next LT Arabic"', 'sans-serif'],
      'arabic-ultralight': ['"DIN Next LT Arabic"', 'sans-serif'],
    },
    fontWeight: {
      'arabic-ultralight': '100',
      'arabic-light': '200',
      'arabic-regular': '400',
      'arabic-medium': '500',
      'arabic-bold': '700',
      'arabic-black': '900',
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
