import { Component } from "react";
import { Link } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import "./index.css";

class Header extends Component {
  state = {
    userImage: "",
  };

  componentDidMount() {
    this.getUserDetails();
  }

  getUserDetails = async () => {
    const response = await fetch("/home");
    if (response.ok) {
      const finalData = await response.json();
      this.setState({
        userImage: finalData.photos[0].value,
      });
    }
  };

  onLogout = async () => {
    const response = await fetch("/logout");
    if (response.ok) {
      window.location.reload(); // Reload the page
      //return Redirect("/login");
    }
  };

  render() {
    const { userImage } = this.state;

    return (
      <nav className="header-container">
        <ul className="sections">
          <li className="header-item logo">
            <Link to="/" className="nav-link">
              PROXY.
            </Link>
          </li>
          <li className="header-item">
            <Link to="/" className="nav-link">
              HOME
            </Link>
          </li>
          <li className="header-item">
            <Link to="/creator_section" className="nav-link">
              CREATOR
            </Link>
          </li>
          <li className="header-item">
            <Link to="/editor_section" className="nav-link">
              EDITOR
            </Link>
          </li>
        </ul>

        <ul className="sections">
          <li className="header-item">
            <Link to="/about_section" className="nav-link">
              ABOUT
            </Link>
          </li>
          <li className="header-item">
            <Link to="/contact_section" className="nav-link">
              CONTACT
            </Link>
          </li>
          <li className="header-item" onClick={this.onLogout}>
            Logout
          </li>
          <li className="header-item user-icon">
            <Link to="/" className="nav-link">
              {userImage ? (
                <img alt="user-img" src={userImage} className="user-img" />
              ) : (
                <CiUser />
              )}
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}
export default Header;
