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
class Login extends Component {
  render() {
    console.log("login file");
    return (
      <div>
        <a href="http://localhost:5000/oauth/google">
          <button>Login With Google</button>
        </a>
      </div>
    );
  }
}

export default Login;
