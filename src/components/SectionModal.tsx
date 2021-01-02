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
  setSelectedCRN: (crn: string | null) => void;
};
export default function SectionModal({ section, setSelectedCRN }: PropTypes) {
  const instructors = Array.from(
    new Set(section.periods.map((p) => p.instructors).flat())
  );

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            {section.course_title} - {section.course_subject_prefix}{" "}
            {section.course_number}
          </p>
        </header>
        <section className="modal-card-body">
          <p>
            <strong>{instructors.length} Instructors:</strong>
            {Array.from(instructors).join(", ")}
          </p>
          <table className="table is-fullwidth is-narrow">
            <thead>
              <tr>
                <th>Days</th>
                <th>Class</th>
                <th>Start</th>
                <th>End</th>
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
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success">Save</button>
          <button className="button" onClick={() => setSelectedCRN(null)}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
}
