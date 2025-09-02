import React, { useEffect } from "react";
import { ConfigDataProvider, ConfigDataContextType } from "@lib/contexts";
import root from "react-shadow";
import css from "../styles/index.css?inline";

type RootProps = {
  children: React.ReactNode;
  options: ConfigDataContextType;
  containerProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
};

function Root({ children, options, containerProps }: RootProps) {
  const { style, ...containerProp } = containerProps || {};

  // Load fonts using FontFace API to properly register them
  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Define the fonts with proper URLs
        const fontDefinitions = [
          {
            family: 'DIN Next LT Arabic',
            weight: '400',
            url: `${import.meta.env.BASE_URL}fonts/Fonts_ArbFONTS-DINNextLTArabic-Regular-4.ttf`
          },
          {
            family: 'DIN Next LT Arabic',
            weight: '500',
            url: `${import.meta.env.BASE_URL}fonts/Fonts_DINNextLTArabic-Medium.ttf`
          },
          {
            family: 'DIN Next LT Arabic',
            weight: '700',
            url: `${import.meta.env.BASE_URL}fonts/Fonts_ArbFONTS-DINNextLTArabic-Bold-4.ttf`
          }
        ];

        // Load each font using FontFace API
        for (const def of fontDefinitions) {
          try {
            const fontFace = new FontFace(def.family, `url(${def.url})`, {
              weight: def.weight,
              style: 'normal',
              display: 'swap'
            });
            
            const loadedFont = await fontFace.load();
            document.fonts.add(loadedFont);
          } catch (fontError) {
            console.error(`Failed to load font ${def.family} weight ${def.weight}:`, fontError);
          }
        }

        console.log('Arabic fonts loading completed - DIN Next LT Arabic is now available!');
        
      } catch (error) {
        console.error('Font loading failed:', error);
      }
    };

    loadFonts();
  }, []);

  return (
    <root.div>
      <ConfigDataProvider data={options}>{children}</ConfigDataProvider>
      <style>{css}</style>
    </root.div>
  );
}

export default Root;
