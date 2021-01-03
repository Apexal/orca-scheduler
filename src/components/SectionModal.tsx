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
  updateSection: (crn: string, updates: Partial<CourseSection>) => void;
  setSelectedCRN: (crn: string | null) => void;
};
export default function SectionModal({
  section,
  updateSection,
  setSelectedCRN
}: PropTypes) {
  const handleChange = (key: string, value: string) => {
    updateSection(section.crn, {
      [key]: value
    });
  };

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            {section.course_subject_prefix} {section.course_number}
          </p>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <div className="control">
              <input
                onChange={(event) =>
                  handleChange("course_title", event.currentTarget.value)
                }
                name="course_title"
                type="text"
                className="input"
                defaultValue={section.course_title}
              />
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={() => setSelectedCRN(null)}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}
