export type Options = {
  token: string;
  initialMessage: string;
  copilotName: string;
  userProfile: string;
  chatPosition?: "left" | "right";
  language?: "en" | "ar";
  chatPlaceholder?: string;
  darkMode?: boolean;
  containerProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
};
