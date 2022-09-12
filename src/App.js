import React from "react";
import { Link } from "react-router-dom";
import { Switch, Route, Redirect } from "react-router-dom";
import Calendar from "./Calendar";

import Plan from "./model/Plan";

import "./App.css";

function App() {

  function aktuelleMitarbeiter(plan) {
    const entry = plan.currentWeekEntry;
    if (!entry) {
      return ""
    }
    return ` (${entry.mitarbeiter} ${entry.helfer ? "& " + entry.helfer : ""})`;
  }

  function home() {
    return (
      <div className="app-content">
        <h1>Vaterhaus Kindergottesdienst</h1>
        <h3>Kalender (Mitarbeiter aktuelle Woche)</h3>
        <Link to="/kleine" className="listLink">
          Kleine {aktuelleMitarbeiter(Plan.kleine)}
        </Link>
        <Link to="/grosse" className="listLink">
          Große {aktuelleMitarbeiter(Plan.grosse)}
        </Link>
        <h3>Links</h3>
        <a href="https://kigo.ccsnh.de/material/" className="listLink">Material</a>
      </div>
    );
  }

  return (
    <Switch>
      <Route path='/home' component={home} />
      <Route path='/kleine/:mitarbeiterFilter?' render={(props) => <Calendar {...props} plan={Plan.kleine} />} />
      <Route path='/mittlere/:mitarbeiterFilter?' render={(props) => <Calendar {...props} plan={Plan.mittlere} />} />
      <Route path='/grosse/:mitarbeiterFilter?' render={(props) => <Calendar {...props} plan={Plan.grosse} />} />
      <Redirect from="/" to="/home" />
    </Switch>
  );
}

export default App;