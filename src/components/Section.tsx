import React from "react";
import { CourseSection } from "../interfaces";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type PropTypes = {
  section: CourseSection;
  setSelectedCRN: (crn: string | null) => void;
  removeSection: (crn: string) => void;
};
export default function Section({
  section,
  removeSection,
  setSelectedCRN
}: PropTypes) {
  return (
    <div className="box section-box">
      <div className="buttons section-buttons">
        <button
          className="button is-warning is-small edit-button"
          onClick={() => setSelectedCRN(section.crn)}
        >
          Edit
        </button>
        <button
          className="button is-danger is-small remove-button"
          onClick={() => removeSection(section.crn)}
        >
          X
        </button>
      </div>
      <summary>
        <strong className="is-size-5">
          {section.course_title} - {section.course_subject_prefix}{" "}
          {section.course_number}
        </strong>
      </summary>

      <strong></strong>
      <p className="subtitle is-size-6">
        CRN {section.crn} | Section {section.section_id} |{" "}
        {section.credits.join("/")} Credits | {section.instruction_method}
      </p>

      {/* <details>
        <summary>Show Schedule</summary>

        <div className="table-container">
          <table className="table is-fullwidth is-narrow">
            <thead>
              <tr>
                <th>Days</th>
                <th>Class</th>
                <th>Time</th>
                <th>Location</th>
                <th>Instructors</th>
              </tr>
            </thead>
            <tbody>
              {section.periods.map((p) => (
                <tr key={p.days + p.start_time}>
                  <td>{p.days.map((d: number) => dayNames[d]).join(", ")}</td>
                  <td className="is-capitalized">{p.type}</td>
                  <td>
                    {p.start_time} - {p.end_time}
                  </td>
                  <td>{p.location || "—"}</td>
                  <td>{p.instructors.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details> */}
    </div>
  );
}
