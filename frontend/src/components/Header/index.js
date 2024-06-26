import { Component } from "react";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import defaultUserImage from "./default-avatar-profile-icon-vector-social-media-user-image-182145777.webp";
import "./index.css";

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
      <nav className="header-container">
        <Link to="/" className="nav-link">
          <img
            alt="proxy-logo"
            src="https://media-content.ccbp.in/website/ccbp_website_logos/nxtwave_header_logo.png"
            className="proxy-logo"
          />
        </Link>

        <ul className="header-list">
          <li className="header-item header-request">
            <Link to="/request_section" className="nav-link">
              REQUEST
            </Link>
          </li>
          <li className="header-item header-user-name">{userName}</li>
          <li className="header-item menu">
            <RxHamburgerMenu
              className="menu-logo"
              onClick={this.onToggleMenuContainer}
            />

            <img
              alt="header-user-img"
              src={userImage ? userImage : defaultUserImage}
              className="header-user-img"
              onClick={this.onToggleMenuContainer}
              //   onError={(err) => {
              //     err.currentTarget.src =
              //       "/default-avatar-profile-icon-vector-social-media-user-image-182145777.webp";
              //     err.currentTarget.onerror = null;
              //   }}
            />
            <ul
              className={`menu-container ${
                showMenuContainer && "show-menu-container"
              }`}
            >
              <li className="menu-item menu-user-item">
                <img
                  alt="menu-user-img"
                  src={userImage ? userImage : defaultUserImage}
                  className="menu-user-image"
                  //   onError={(err) => {
                  //     err.currentTarget.src =
                  //       "/default-avatar-profile-icon-vector-social-media-user-image-182145777.webp";
                  //     err.currentTarget.onerror = null;
                  //   }}
                />

                <p className="menu-user-name">{userName}</p>

                <IoMdClose
                  className="menu-close-icon"
                  onClick={this.onCloseMenuContainer}
                />
              </li>
              <li className="menu-item ">
                <Link to="/" className="nav-link">
                  HOME
                </Link>
              </li>
              <li className="menu-item ">
                <Link to="/creator_section" className="nav-link">
                  CREATOR
                </Link>
              </li>
              <li className="menu-item ">
                <Link to="/editor_section" className="nav-link">
                  EDITOR
                </Link>
              </li>
              <li className="menu-item ">
                <Link to="/request_section" className="nav-link">
                  REQUEST
                </Link>
              </li>
              <li className="menu-item " onClick={this.onLogout}>
                Log Out
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    );
  }
}
export default Header;
