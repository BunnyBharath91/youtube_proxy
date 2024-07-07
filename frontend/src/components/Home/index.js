import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import Header from "../Header";
import {
  HomeContainer,
  UpperDescription,
  MainDescription,
  LowerDescription,
  StyledLink,
  GetStartedButton,
} from "./styledComponents";
import { homeSectionContent } from "./languageContent";

const Home = () => {
  const getHomeSectionData = (activeLanguage) => {
    switch (activeLanguage) {
      case "AR":
        return homeSectionContent.AR;
      case "BN":
        return homeSectionContent.BN;
      case "ZH":
        return homeSectionContent.ZH;
      case "EN":
        return homeSectionContent.EN;
      case "FR":
        return homeSectionContent.FR;
      case "HI":
        return homeSectionContent.HI;
      case "PT":
        return homeSectionContent.PT;
      case "RU":
        return homeSectionContent.RU;
      case "ES":
        return homeSectionContent.ES;
      case "TE":
        return homeSectionContent.TE;
      case "UR":
        return homeSectionContent.UR;

      default:
        return null;
    }
  };

  return (
    <LanguageAndAccessibilityContext.Consumer>
      {(value) => {
        const { activeLanguage, fontSizeRatio, showInGray } = value;
        const fsr = fontSizeRatio;
        console.log("home section Ratio: ", fontSizeRatio);
        const {
          upperDescription,
          mainDescription,
          lowerDescription,
        } = getHomeSectionData(activeLanguage);

        return (
          <div className={`${showInGray && "show-in-gray"} bg-container`}>
            <div className="main-container">
              <Header ratio={fsr} />

              <HomeContainer>
                <UpperDescription ratio={fsr}>
                  {upperDescription}
                </UpperDescription>
                <MainDescription ratio={fsr}>{mainDescription}</MainDescription>
                <LowerDescription ratio={fsr}>
                  {lowerDescription}
                </LowerDescription>
                <StyledLink to="/editor_section">
                  <GetStartedButton ratio={fsr}>Get Started</GetStartedButton>
                </StyledLink>
              </HomeContainer>
            </div>
            <AccessibilitySection />

            <ToastContainer
              position="top-center"
              autoClose={4000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Slide}
              stacked
            />
          </div>
        );
      }}
    </LanguageAndAccessibilityContext.Consumer>
  );
};

export default Home;
