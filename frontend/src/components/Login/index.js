// import React, { Component } from "react";

// class Login extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loginContent: "",
//     };
//   }

//   componentDidMount() {
//     this.fetchLoginContent();
//   }

//   fetchLoginContent = async () => {
//     try {
//       const response = await fetch("/login");
//       if (response.ok) {
//         const htmlContent = await response.text();
//         this.setState({ loginContent: htmlContent });
//       } else {
//         console.error("Failed to fetch login content");
//       }
//     } catch (error) {
//       console.error("Error fetching login content:", error);
//     }
//   };

//   render() {
//     return (
//       <div dangerouslySetInnerHTML={{ __html: this.state.loginContent }} />
//     );
//   }
// }

// export default Login;

import { Component } from "react";
import { Redirect } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      loading: true,
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

  render() {
    const { isAuthenticated, loading } = this.state;

    if (loading) {
      return <h1>Loading...</h1>;
    }

    if (isAuthenticated) {
      return <Redirect to="/" />;
    } else {
      return (
        <div>
          <a href="http://localhost:5000/oauth/google">
            <button>Login With Google</button>
          </a>
        </div>
      );
    }
  }
}

export default Login;
