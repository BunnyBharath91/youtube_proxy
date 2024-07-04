import { Component } from "react";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import { IoMdClose } from "react-icons/io";

import defaultUserImage from "./default-avatar-profile-icon-vector-social-media-user-image-182145777.webp";
import {
    HeaderContainer,
    ProxyLogo,
    HeaderList,
    HeaderItem,
    StyledLink,
    SelectLanguage,
    LanguageContainer,
    LanguageItem,
    MenuLogo,
    HeaderUserImage,
    MenuContainer,
    MenuItem,
    MenuUserItem,
    MenuUserImage,
    MenuUserName,
    MenuCloseIcon,
    StyledDropDown,
    Languages,
    SelectedMark,
} from "./styledComponents";
import { headerSectionContent } from "./languageContent";

const languagesList = [
    { language: "عربي", code: "AR" },
    { language: "বাংলা", code: "BN" },
    { language: "中國人", code: "ZH" },
    { language: "English", code: "EN" },
    { language: "Français", code: "FR" },
    { language: "हिंदी", code: "HI" },
    { language: "Português", code: "PT" },
    { language: "Русский", code: "RU" },
    { language: "Español", code: "ES" },
    { language: "తెలుగు", code: "TE" },
    { language: "اردو", code: "UR" },
];

class Header extends Component {
    state = {
        userName: "HELLO! USER",
        userImage: defaultUserImage,
        invitationCode: "",
        showLanguageContainer: false,
        showMenuContainer: false,
    };

    getHeaderSectionData = (activeLanguage) => {
        switch (activeLanguage) {
            case "AR":
                return headerSectionContent.AR;
            case "BN":
                return headerSectionContent.BN;
            case "ZH":
                return headerSectionContent.ZH;
            case "EN":
                return headerSectionContent.EN;
            case "FR":
                return headerSectionContent.FR;
            case "HI":
                return headerSectionContent.HI;
            case "PT":
                return headerSectionContent.PT;
            case "RU":
                return headerSectionContent.RU;
            case "ES":
                return headerSectionContent.ES;
            case "TE":
                return headerSectionContent.TE;
            case "UR":
                return headerSectionContent.UR;

            default:
                return null;
        }
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

    onToggleLanguageContainer = () => {
        this.setState((prevState) => ({
            showLanguageContainer: !prevState.showLanguageContainer,
        }));
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

    onShowMenuContainer = () => {
        this.setState({
            showMenuContainer: true,
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
        const {
            userName,
            userImage,
            showLanguageContainer,
            showMenuContainer,
        } = this.state;
        console.log("showMenuContainer", showMenuContainer);
        console.log("showLanguageContainer:", showLanguageContainer);

        return (
            <LanguageAndAccessibilityContext.Consumer>
                {(value) => {
                    const {
                        activeLanguage,
                        changeLanguage,
                        fontSizeRatio: fsr,
                        showUnderLines: sUl,
                    } = value;
                    console.log("showUnderLines:", sUl);
                    const {
                        request,
                        home,
                        creator,
                        editor,
                        logout,
                    } = this.getHeaderSectionData(activeLanguage);
                    const selectedLanguage = languagesList.filter(
                        (eachItem) => eachItem.code === activeLanguage
                    )[0].language;

                    return (
                        <HeaderContainer>
                            <StyledLink to="/">
                                <ProxyLogo
                                    alt="proxy-logo"
                                    src="https://media-content.ccbp.in/website/ccbp_website_logos/nxtwave_header_logo.png"
                                />
                            </StyledLink>

                            <HeaderList>
                                <HeaderItem
                                    onClick={this.onToggleLanguageContainer}
                                    language
                                    ratio={fsr}
                                >
                                    <SelectLanguage>
                                        <Languages /> {selectedLanguage}{" "}
                                        <StyledDropDown rotate={showLanguageContainer} />
                                    </SelectLanguage>
                                    <LanguageContainer show={showLanguageContainer}>
                                        {languagesList.map((eachItem) => (
                                            <LanguageItem
                                                key={eachItem.code}
                                                value={eachItem.code}
                                                onClick={() => {
                                                    changeLanguage(eachItem.code);
                                                }}
                                                selected={activeLanguage === eachItem.code}
                                            >
                                                <SelectedMark show={eachItem.code === activeLanguage} />
                                                {eachItem.language}
                                            </LanguageItem>
                                        ))}
                                    </LanguageContainer>
                                </HeaderItem>
                                <HeaderItem request ratio={fsr}>
                                    <StyledLink to="/request_section" sUl={sUl}>
                                        {request}
                                    </StyledLink>
                                </HeaderItem>
                                <HeaderItem username ratio={fsr}>
                                    {userName}
                                </HeaderItem>
                                <HeaderItem menu ratio={fsr}>
                                    <MenuLogo onClick={this.onShowMenuContainer} />

                                    <HeaderUserImage
                                        alt="header-user-img"
                                        src={userImage ? userImage : defaultUserImage}
                                        onClick={this.onToggleMenuContainer}
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

                                            <MenuCloseIcon onClick={this.onCloseMenuContainer}>
                                                <IoMdClose />
                                            </MenuCloseIcon>
                                        </MenuUserItem>

                                        <StyledLink to="/" sUl={sUl}>
                                            <MenuItem>{home}</MenuItem>
                                        </StyledLink>

                                        <StyledLink to="/creator_section" sUl={sUl}>
                                            <MenuItem>{creator}</MenuItem>
                                        </StyledLink>

                                        <StyledLink to="/editor_section" sUl={sUl}>
                                            <MenuItem>{editor}</MenuItem>
                                        </StyledLink>

                                        <StyledLink to="/request_section" sUl={sUl}>
                                            <MenuItem>{request}</MenuItem>
                                        </StyledLink>

                                        <MenuItem onClick={this.onLogout}>{logout}</MenuItem>
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
