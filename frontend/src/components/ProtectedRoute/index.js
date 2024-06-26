import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import loading from "../../images/loading.png";
import { TailSpin } from "react-loader-spinner";

class ProtectedRoute extends Component {
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
        console.log(data);
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

  renderLoading = () => {
    return (
      <div className="request-section loading-section">
        <TailSpin type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    );
  };

  render() {
    const { component: Component, ...rest } = this.props;
    const { isAuthenticated, loading } = this.state;

    if (loading) {
      return this.renderLoading();
    }

    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
        }
      />
    );
  }
}

export default ProtectedRoute;
