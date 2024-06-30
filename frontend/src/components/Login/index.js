import { Component } from "react";
import { Redirect } from "react-router-dom";

import { TailSpin } from "react-loader-spinner";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import {
  HeaderContainer,
  ProxyLogo,
  HeaderList,
  HeaderItem,
  LoginMenuLogo,
  MenuContainer,
  MenuItem,
  MenuCloseIcon,
  AnchorTag,
  SignInButton,
  SignInUserImg,
  LoginContainer,
  UpperDescription,
  MainDescription,
  LowerDescription,
  GetStartedButton,
} from "./styledComponents";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      loading: true,
      showMenuContainer: false,
    };
  }

  componentDidMount() {
    this.checkAuthStatus();
  }

  checkAuthStatus = async () => {
    try {
      const response = await fetch("/oauth/status");
      if (response.ok) {
        const data = await response.json();
        this.setState({
          isAuthenticated: data.authenticated,
          loading: false,
        });
      } else {
        console.log(response.statusText);
        this.setState({
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      this.setState({
        loading: false,
      });
    }
  };

  onToggleMenuContainer = () => {
    this.setState((prevState) => ({
      showMenuContainer: !prevState.showMenuContainer,
    }));
  };

  onCloseMenuContainer = () => {
    this.setState({
      showMenuContainer: false,
    });
  };

  renderLoading = () => {
    return (
      <div className="request-section loading-section">
        <TailSpin type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    );
  };

  renderLoginSection = (fsr, sUl) => {
    const { showMenuContainer } = this.state;
    return (
      <>
        <HeaderContainer>
          <ProxyLogo
            alt="proxy-logo"
            src="https://media-content.ccbp.in/website/ccbp_website_logos/nxtwave_header_logo.png"
          />

          <HeaderList className="header-list">
            <HeaderItem about ratio={fsr}>
              ABOUT
            </HeaderItem>
            <HeaderItem contact ratio={fsr}>
              CONTACT
            </HeaderItem>
            <HeaderItem ratio={fsr}>
              <AnchorTag href="http://localhost:5000/oauth/google" sUl={sUl}>
                <SignInButton className="sign-in-button" outline ratio={fsr}>
                  <SignInUserImg />
                  Sign In
                </SignInButton>
              </AnchorTag>
            </HeaderItem>
            <HeaderItem menu>
              <LoginMenuLogo onClick={this.onToggleMenuContainer} />

              <MenuContainer show={showMenuContainer} ratio={fsr}>
                <MenuItem className="menu-item menu-sign-in-item">
                  <a href="http://localhost:5000/oauth/google">
                    <SignInButton className="sign-in-button">
                      Sign In
                    </SignInButton>
                  </a>
                  <MenuCloseIcon onClick={this.onCloseMenuContainer} />
                </MenuItem>
                <MenuItem>ABOUT</MenuItem>
                <MenuItem>CONTACT </MenuItem>
              </MenuContainer>
            </HeaderItem>
          </HeaderList>
        </HeaderContainer>
        <div className="main-container">
          <LoginContainer>
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

            <a href="http://localhost:5000/oauth/google">
              <GetStartedButton ratio={fsr}>Get Started</GetStartedButton>
            </a>
          </LoginContainer>
        </div>
      </>
    );
  };

  render() {
    const { isAuthenticated, loading } = this.state;

    if (isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const { fontSizeRatio, showInGray, showUnderLines: sUl } = value;
          const fsr = fontSizeRatio;
          console.log(fontSizeRatio);

          return (
            <div className={`${showInGray && "show-in-gray"} bg-container`}>
              {loading
                ? this.renderLoading()
                : this.renderLoginSection(fsr, sUl)}
              <AccessibilitySection />
            </div>
          );
        }}
      </LanguageAndAccessibilityContext.Consumer>
    );
  }
}

export default Login;
