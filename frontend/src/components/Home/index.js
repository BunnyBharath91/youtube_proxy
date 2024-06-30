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

const Home = () => (
  <LanguageAndAccessibilityContext.Consumer>
    {(value) => {
      const { fontSizeRatio, showInGray } = value;
      const fsr = fontSizeRatio;
      console.log("home section Ratio: ", fontSizeRatio);

      return (
        <div className={`${showInGray && "show-in-gray"} bg-container`}>
          <div className="main-container">
            <Header ratio={fsr} />

            <HomeContainer>
              <UpperDescription ratio={fsr}>
                Streamlining YouTube Collaboration
              </UpperDescription>
              <MainDescription ratio={fsr}>
                Empower editors to upload videos on behalf of creators with a
                seamless approval process
              </MainDescription>
              <LowerDescription ratio={fsr}>
                Effortlessly manage secure video uploads with creator consent.
                Boost productivity and ensure seamless, trusted management with
                Proxy's innovative platform.
              </LowerDescription>
              <StyledLink to="/editor_section">
                <GetStartedButton ratio={fsr}>Get Started</GetStartedButton>
              </StyledLink>
            </HomeContainer>
          </div>
          <AccessibilitySection />
        </div>
      );
    }}
  </LanguageAndAccessibilityContext.Consumer>
);

export default Home;
