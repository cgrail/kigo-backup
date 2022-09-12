import kleine from "./kleine";
import grosse from "./grosse";

import dayjs from 'dayjs';

function parsePlan(plan, id, title) {
    const currentDate = new Date();
    var currentWeekEntry = undefined;
    const parsedPlan = plan.map(entry => {
        const date = dayjs(entry.datum);
        const endOfDay = date.add(1, "day");
        const oneWeekAhead = date.subtract(6, "day");
        entry.cssClasses = "";
        entry.isCurrentWeek = !plan.currentWeekEntry && currentDate > oneWeekAhead && currentDate < endOfDay;
        if (entry.isCurrentWeek) {
            currentWeekEntry = entry;
            entry.cssClasses += " currentWeek";
        }
        entry.isOld = endOfDay < currentDate;
        entry.formattedDate = date.toDate().toLocaleDateString("de", {
            day: "numeric",
            month: "short"
        });
        if(entry.mitarbeiter === "DMG" || entry.mitarbeiter === "Helen"){
            entry.cssClasses += " noTopic";
        }
        if(!entry.mitarbeiter || entry.mitarbeiter === ""){
            entry.cssClasses += " noMitarbeiter";
        }
        return entry;
    });
    return {
        id: id,
        gruppe: title,
        plan: parsedPlan,
        currentWeekEntry: currentWeekEntry
    };
}

export default {
    kleine: parsePlan(kleine, "kleine", "Kleine"),
    grosse: parsePlan(grosse, "grosse", "Große")
}