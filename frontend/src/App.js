import { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import EditorSection from "./components/EditorSection";
import CreatorSection from "./components/CreatorSection";
import Login from "./components/Login";
import "./App.css";

class App extends Component {
  state = {
    isAuthenticated: false,
    loading: true,
  };

  componentDidMount() {
    this.checkAuthStatus();
  }

  checkAuthStatus = async () => {
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
    }
  };

  render() {
    const { isAuthenticated, loading } = this.state;
    if (loading) {
      return <div>Loading...</div>;
    }
    console.log(loading);
    console.log("app.js file");
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            {isAuthenticated ? <Home /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/login">
            {!isAuthenticated && <Login />}
          </Route>
          <Route exact path="/creator_section">
            {isAuthenticated ? <CreatorSection /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/editor_section">
            {isAuthenticated ? <EditorSection /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
