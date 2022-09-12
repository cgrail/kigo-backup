import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";

function Calendar(props) {
  let { mitarbeiterFilter } = useParams();

  const allKey = "Alle";

  const [plan, setPlan] = useState([]);
  const [mitarbeiter, setMitarbeiter] = useState([]);
  const [title, setTitle] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterPast, setFilterPast] = useState(true);

  useEffect(() => {
    const json = props.plan;
    const mitarbeiterList = {};
    function addMitarbeiter(mitarbeiter) {
      if (!mitarbeiter || mitarbeiter.length === 0) {
        return;
      }
      if (mitarbeiterList[mitarbeiter]) {
        mitarbeiterList[mitarbeiter] += 1;
      } else {
        mitarbeiterList[mitarbeiter] = 1;
      }
    }
    const newPlan = json.plan
      .filter(entry => {
        if (filterPast && entry.isOld) {
          return false;
        }
        addMitarbeiter(entry.mitarbeiter);
        addMitarbeiter(entry.helfer);
        if (mitarbeiterFilter && mitarbeiterFilter !== allKey && (entry.mitarbeiter !== mitarbeiterFilter && entry.helfer !== mitarbeiterFilter)) {
          return false;
        }
        return true;
      });
    setPlan(newPlan);
    const mitarbeiter = Object.keys(mitarbeiterList).map(e => {
      return { name: e, count: mitarbeiterList[e] };
    });
    mitarbeiter.push({
      name: allKey
    });
    setMitarbeiter(mitarbeiter);
    setTitle("Kigo Kalender - " + json.gruppe);
  }, [props.plan, mitarbeiterFilter, filterPast]);

  function closePopup() {
    setShowFilter(false);
  }

  function onSettingsClicked(event) {
    setShowFilter(true);
  }

  function toggleFilterPast() {
    setFilterPast(!filterPast);
    closePopup();
  }

  if (showFilter) {
    return (
      <div className="popover">
        <div style={{ padding: "1rem" }}>Filter</div>
        <div>
          {mitarbeiter.map(mitarbeiter => (
            <Link key={mitarbeiter.name}
              to={`/${props.plan.id}/${mitarbeiter.name}`}
              className="listLink"
              onClick={closePopup}>
              {mitarbeiter.name === allKey ? "Alle Mitarbeiter" : mitarbeiter.name} {mitarbeiter.count ? `(${mitarbeiter.count})` : ""}
            </Link>
          ))}
        </div>

        <div style={{ padding: "1rem" }}>
          {!filterPast && <button onClick={toggleFilterPast} className="buttonLink">Nur aktuelle Termine anzeigen</button>}
          {filterPast && <button onClick={toggleFilterPast} className="buttonLink">Auch alte Termine anzeigen</button>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bar">
        <Link to="/">Zurück</Link>
        <div>{title}</div>
        <button onClick={onSettingsClicked} className="buttonLink">
          Filter
        </button>
      </div>

      <div style={{ padding: "1rem" }}>
        {plan.map(item => (
          <div key={item.datum} className={"planItem" + item.cssClasses}>
            <div style={{ width: "4.5rem", color: "#7c7f82" }}>
              {item.formattedDate}
            </div>
            <div style={{ minWidth: "14rem" }}>
              <div>
                {item.mitarbeiter || "Kein Mitarbeiter"} {item.helfer && " & " + item.helfer}
              </div>
              <div>
                <a href={item.dokument}>{item.thema}</a>
                {item.material &&
                  <div><a href={item.material}>Material</a>
                  </div>
                }
              </div>
            </div>
          </div>
        ))}
        {plan.length === 0 && "Kein aktueller Plan vorhanden"}
      </div>
    </div >
  );
}

export default Calendar;
