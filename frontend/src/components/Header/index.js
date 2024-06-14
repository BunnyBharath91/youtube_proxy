import { Link } from "react-router-dom";
import "./index.css";

const Header = () => (
  <div className="header-container">
    <ul className="header-list">
      <Link to="/">
        <li>Home</li>
      </Link>
      <Link to="/creator_section">
        <li>Creator Section</li>
      </Link>
      <Link to="/editor_section">
        <li>Editor Section</li>
      </Link>
    </ul>
  </div>
);

export default Header;
