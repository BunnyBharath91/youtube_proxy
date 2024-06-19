import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import EditorSection from "./components/EditorSection";
import CreatorSection from "./components/CreatorSection";
import CreatorRequestDetails from "./components/CreatorRequestDetails";
import EditorRequestDetails from "./components/EditorRequestDetails";
import RequestSection from "./components/RequestSection";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const App = () => (
  <BrowserRouter>
    <Switch>
      <ProtectedRoute exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <ProtectedRoute
        exact
        path="/creator_section"
        component={CreatorSection}
      />
      <ProtectedRoute exact path="/editor_section" component={EditorSection} />
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
  </BrowserRouter>
);

export default App;
