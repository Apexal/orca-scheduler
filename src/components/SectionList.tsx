import React from "react";
import { CourseSection } from "../interfaces";
import Section from "./Section";

type PropTypes = {
  crns: string[];
  sections: CourseSection[];
  setSelectedCRN: (crn: string | null) => void;
};
export default function SectionList({
  crns,
  sections,
  setSelectedCRN
}: PropTypes) {
  return (
    <div>
      <h2 className="title is-size-4">Your Courses</h2>
      <form className="mb-4 is-flex">
        <input
          className="input is-rounded"
          type="text"
          placeholder="Your CRNs from SIS"
        />
        <button className="button is-rounded is-danger ml-2" type="button">
          Clear
        </button>
      </form>
      <div className="sections">
        {sections.map((s) => (
          <Section key={s.crn} section={s} setSelectedCRN={setSelectedCRN} />
        ))}
      </div>
    </div>
  );
}
