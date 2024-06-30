import React from "react";

const LanguageAndAccessibilityContext = React.createContext({
  fontSizeRatio: "",
  increaseRatio: () => {},
  decreaseRatio: () => {},
  showInGray: "",
  toggleGrayScale: () => {},
  showUnderLines: "",
  toggleUnderLines: () => {},
  resetSettings:()=>{}
});

export default LanguageAndAccessibilityContext;
