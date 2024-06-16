import { Link } from "react-router-dom";
import Header from "../Header";
import "./index.css";

const Home = () => (
  <div className="bg-container">
    <Header />
    <main className="home-container">
      <p className="upper-description">Streamlining YouTube Collaboration</p>
      <h1 className="main-description">
        Empower editors to upload videos on behalf of creators with a seamless
        approval process
      </h1>
      <p className="lower-description">
        Effortlessly manage secure video uploads with creator consent. Boost
        productivity and ensure seamless, trusted management with Proxy's
        innovative platform.
      </p>
      <Link to="/editor_section" className="nav-link">
        <button className="get-started-button">Get Started</button>
      </Link>
    </main>
  </div>
);

export default Home;
