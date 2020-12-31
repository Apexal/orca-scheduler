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
      <details>
        <summary>
          <strong>
            {section.crn} - {section.course_title} -{" "}
            {section.course_subject_prefix} {section.course_number}
          </strong>
        </summary>

        <strong></strong>
        <p>
          Offered for {section.credits.join("/")} credits. Taught by{" "}
          {section.periods
            .map((p) => p.instructors)
            .flat()
            .join(",")}
        </p>

        <table>
          <thead>
            <tr>
              <th>Days</th>
              <th>Class</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {section.periods.map((p) => (
              <tr key={p.days + p.start_time}>
                <td>{p.days.map((d: number) => dayNames[d]).join(", ")}</td>
                <td>{p.type}</td>
                <td>{p.start_time}</td>
                <td>{p.end_time}</td>
                <td>{p.location || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button>Edit</button>
        <button>Remove</button>
      </details>
    </div>
  );
}
