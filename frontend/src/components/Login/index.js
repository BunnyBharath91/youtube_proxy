import { Component } from "react";
import { Redirect } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import "./index.css";

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

  render() {
    const { isAuthenticated, loading, showMenuContainer } = this.state;

    if (loading) {
      return <h1>Loading...</h1>;
    }

    if (isAuthenticated) {
      return <Redirect to="/" />;
    }
    // <a href="http://localhost:5000/oauth/google">
    //         <button>Login With Google</button>
    //       </a>

    return (
      <div className="bg-container">
        <div className="main-container">
          <nav className="header-container">
            <img
              alt="proxy-logo"
              src="https://media-content.ccbp.in/website/ccbp_website_logos/nxtwave_header_logo.png"
              className="proxy-logo"
            />

            <ul className="header-list">
              <li className="header-item header-about">ABOUT</li>
              <li className="header-item header-contact">CONTACT</li>
              <li className="header-item header-sign-in">
                <a href="http://localhost:5000/oauth/google">
                  <button className="sign-in-button">Sign In</button>
                </a>
              </li>
              <li className="header-item menu">
                <RxHamburgerMenu
                  className="login-menu-logo"
                  onClick={this.onToggleMenuContainer}
                />
                <ul
                  className={`menu-container ${
                    showMenuContainer && "show-menu-container"
                  }`}
                >
                  <li className="menu-item menu-sign-in-item">
                    <a href="http://localhost:5000/oauth/google">Sign In</a>

                    <IoMdClose
                      className="menu-close-icon"
                      onClick={this.onCloseMenuContainer}
                    />
                  </li>
                  <li className="menu-item ">ABOUT</li>
                  <li className="menu-item ">CONTACT </li>
                </ul>
              </li>
            </ul>
          </nav>

          <main className="home-container">
            <p className="upper-description">
              Streamlining YouTube Collaboration
            </p>
            <h1 className="main-description">
              Empower editors to upload videos on behalf of creators with a
              seamless approval process
            </h1>
            <p className="lower-description">
              Effortlessly manage secure video uploads with creator consent.
              Boost productivity and ensure seamless, trusted management with
              Proxy's innovative platform.
            </p>

            <a href="http://localhost:5000/oauth/google">
              <button className="get-started-button">Get Started</button>
            </a>
          </main>
        </div>
      </div>
    );
  }
}

export default Login;
