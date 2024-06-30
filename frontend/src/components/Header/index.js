import { Component } from "react";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import defaultUserImage from "./default-avatar-profile-icon-vector-social-media-user-image-182145777.webp";
import {
  HeaderContainer,
  ProxyLogo,
  HeaderList,
  HeaderItem,
  StyledLink,
  MenuLogo,
  HeaderUserImage,
  MenuContainer,
  MenuItem,
  MenuUserItem,
  MenuUserImage,
  MenuUserName,
  MenuCloseIcon,
} from "./styledComponents";

class Header extends Component {
  state = {
    userName: "HELLO! USER",
    userImage: "",
    invitationCode: "",
    showMenuContainer: false,
  };

  componentDidMount() {
    this.getUserDetails();
  }

  getUserDetails = async () => {
    const response = await fetch("/user/details");
    if (response.ok) {
      const finalData = await response.json();
      console.log("final Data: ", finalData);
      this.setState({
        userImage: finalData.userImage,
        userName: finalData.displayName,
        invitationCode: finalData.username,
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

  onLogout = async () => {
    const response = await fetch("/logout");
    if (response.ok) {
      window.location.reload(); // Reload the page
      //return Redirect("/login");
    }
  };

  render() {
    const { userName, userImage, showMenuContainer } = this.state;

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const { fontSizeRatio: fsr, showUnderLines: sUl } = value;
          console.log("showUnderLines:", sUl);

          return (
            <HeaderContainer>
              <StyledLink to="/">
                <ProxyLogo
                  alt="proxy-logo"
                  src="https://media-content.ccbp.in/website/ccbp_website_logos/nxtwave_header_logo.png"
                />
              </StyledLink>

              <HeaderList>
                <HeaderItem request ratio={fsr}>
                  <StyledLink to="/request_section" sUl={sUl}>
                    REQUEST
                  </StyledLink>
                </HeaderItem>
                <HeaderItem username ratio={fsr}>
                  {userName}
                </HeaderItem>
                <HeaderItem menu ratio={fsr}>
                  <MenuLogo>
                    <RxHamburgerMenu onClick={this.onToggleMenuContainer} />
                  </MenuLogo>

                  <HeaderUserImage
                    alt="header-user-img"
                    src={userImage ? userImage : defaultUserImage}
                    onClick={this.onToggleMenuContainer}
                    //   onError={(err) => {
                    //     err.currentTarget.src =
                    //       "/default-avatar-profile-icon-vector-social-media-user-image-182145777.webp";
                    //     err.currentTarget.onerror = null;
                    //   }}
                  />
                  <MenuContainer show={showMenuContainer} ratio={fsr}>
                    <MenuUserItem ratio={fsr}>
                      <MenuUserImage
                        alt="menu-user-img"
                        src={userImage ? userImage : defaultUserImage}

                        //   onError={(err) => {
                        //     err.currentTarget.src =
                        //       "/default-avatar-profile-icon-vector-social-media-user-image-182145777.webp";
                        //     err.currentTarget.onerror = null;
                        //   }}
                      />

                      <MenuUserName className="menu-user-name">
                        {userName}
                      </MenuUserName>

                      <MenuCloseIcon>
                        <IoMdClose onClick={this.onCloseMenuContainer} />
                      </MenuCloseIcon>
                    </MenuUserItem>
                    <MenuItem>
                      <StyledLink to="/" sUl={sUl}>
                        HOME
                      </StyledLink>
                    </MenuItem>
                    <MenuItem>
                      <StyledLink to="/creator_section" sUl={sUl}>
                        CREATOR
                      </StyledLink>
                    </MenuItem>
                    <MenuItem>
                      <StyledLink to="/editor_section" sUl={sUl}>
                        EDITOR
                      </StyledLink>
                    </MenuItem>
                    <MenuItem>
                      <StyledLink to="/request_section" sUl={sUl}>
                        REQUEST
                      </StyledLink>
                    </MenuItem>
                    <MenuItem onClick={this.onLogout}>Log Out</MenuItem>
                  </MenuContainer>
                </HeaderItem>
              </HeaderList>
            </HeaderContainer>
          );
        }}
      </LanguageAndAccessibilityContext.Consumer>
    );
  }
}
export default Header;
