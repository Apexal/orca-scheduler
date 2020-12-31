import React from "react";
import { CourseSection } from "../interfaces";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

type PropTypes = {
  section: CourseSection;
};
export default function Section({ section }: PropTypes) {
  return (
    <div>
      <h3>{section.course_title}</h3>
      <ul>
        {section.periods.map((p) => (
          <li key={p.days + p.start_time}>
            {p.type} - {p.days.map((d: number) => dayNames[d]).join(", ")} -{" "}
            {p.start_time}-{p.end_time}
          </li>
        ))}
      </ul>
    </div>
  );
}
