import { Component } from "react";
import "./index.css";
import Header from "../Header";

class Home extends Component {
  state = {
    userDetails: {
      photos: [{ value: "" }],
      emails: [{ value: "" }],
    },
  };

  componentDidMount() {
    this.getUserDetails();
  }

  getUserDetails = async () => {
    const response = await fetch("/home");
    if (response.ok) {
      const finalData = await response.json();
      this.setState({
        userDetails: finalData,
      });
    } else {
      this.setState({
        userDetails: {
          photos: [
            {
              value:
                "https://images.saatchiart.com/saatchi/864603/art/3068194/2138087-HSC00002-7.jpg",
            },
          ],
          emails: [
            {
              value: "ronaldo@gmail.com",
            },
          ],
        },
      });
    }
  };

  render() {
    const { userDetails } = this.state;

    return (
      <div className="home-container">
        <Header />
        <div className="profile-container">
          <img
            alt="user img"
            src={userDetails.photos[0].value}
            className="user-img"
          />
          <p className="email">{userDetails.emails[0].value}</p>
        </div>
      </div>
    );
  }
}

export default Home;
