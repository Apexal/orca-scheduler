import React from "react";
import { CourseSection } from "../interfaces";
import Section from "./Section";

type PropTypes = {
  crns: string[];
  sections: CourseSection[];
};
export default function SectionList({ crns, sections }: PropTypes) {
  return (
    <div>
      <h2>Your Sections</h2>

      <div className="sections">
        {sections.map((s) => (
          <Section key={s.crn} section={s} />
        ))}
      </div>

      <form>
        <input type="number" placeholder="CRN(s)" />
        <button>Add</button>
      </form>
    </div>
  );
}
