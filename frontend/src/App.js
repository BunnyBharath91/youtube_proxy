import { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import EditorSection from "./components/EditorSection";
import CreatorSection from "./components/CreatorSection";
import CreatorRequestDetails from "./components/CreatorRequestDetails";
import EditorRequestDetails from "./components/EditorRequestDetails";
import RequestSection from "./components/RequestSection";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import LanguageAndAccessibilityContext from "./context/languageAndAccessibilityContext";
import "./App.css";

class App extends Component {
  state = {
    fontSizeRatio: 1,
    showInGray: false,
    showUnderLines: false,
  };

  increaseRatio = () => {
    const { fontSizeRatio } = this.state;
    if (fontSizeRatio <= 1.3) {
      this.setState((prevState) => ({
        fontSizeRatio: prevState.fontSizeRatio + 0.15,
      }));
    } else {
      return alert("max size reached");
    }
  };

  decreaseRatio = () => {
    const { fontSizeRatio } = this.state;
    if (fontSizeRatio >= 0.7) {
      this.setState((prevState) => ({
        fontSizeRatio: prevState.fontSizeRatio - 0.15,
      }));
    } else {
      return alert("min size reached");
    }
  };

  toggleGrayScale = () => {
    this.setState((prevState) => ({
      showInGray: !prevState.showInGray,
    }));
  };

  toggleUnderLines = () => {
    this.setState((prevState) => ({
      showUnderLines: !prevState.showUnderLines,
    }));
  };

  resetSettings = () => {
    this.setState({
      fontSizeRatio: 1,
      showInGray: false,
      showUnderLines: false,
    });
  };

  render() {
    const { fontSizeRatio, showInGray, showUnderLines } = this.state;
    console.log("app.js file fontRatio: ", fontSizeRatio);
    return (
      <BrowserRouter>
        <LanguageAndAccessibilityContext.Provider
          value={{
            fontSizeRatio,
            increaseRatio: this.increaseRatio,
            decreaseRatio: this.decreaseRatio,
            showInGray,
            toggleGrayScale: this.toggleGrayScale,
            showUnderLines,
            toggleUnderLines: this.toggleUnderLines,
            resetSettings: this.resetSettings,
          }}
        >
          <Switch>
            <ProtectedRoute exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <ProtectedRoute
              exact
              path="/creator_section"
              component={CreatorSection}
            />
            <ProtectedRoute
              exact
              path="/editor_section"
              component={EditorSection}
            />
            <ProtectedRoute
              exact
              path="/creator_section/:videoId"
              component={CreatorRequestDetails}
            />

            <ProtectedRoute
              exact
              path="/request_section"
              component={RequestSection}
            />
            <ProtectedRoute
              exact
              path="/editor_section/:videoId"
              component={EditorRequestDetails}
            />
          </Switch>
        </LanguageAndAccessibilityContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
