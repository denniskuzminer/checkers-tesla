import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import landing from "./pages/landing";
import game from "./pages/game";

const App = (props) => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={landing} />
          <Route exact path="/game" component={game} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
