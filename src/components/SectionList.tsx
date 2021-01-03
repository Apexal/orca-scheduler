import React from "react";
import { CourseSection } from "../interfaces";
import Section from "./Section";

type PropTypes = {
  crns: string[];
  sections: CourseSection[];
  setSelectedCRN: (crn: string | null) => void;
  removeSection: (crn: string) => void;
};
export default function SectionList({
  crns,
  sections,
  setSelectedCRN,
  removeSection
}: PropTypes) {
  return (
    <div>
      <h2 className="title is-size-3">Your Courses</h2>
      <div className="sections">
        {sections.map((s) => (
          <Section
            key={s.crn}
            section={s}
            setSelectedCRN={setSelectedCRN}
            removeSection={removeSection}
          />
        ))}
      </div>
    </div>
  );
}
