import React from "react";
import { CourseSection, CourseSectionPeriod } from "../interfaces";
import { copyArrayOfObjs } from "../utils";

const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type PropTypes = {
  section: CourseSection;
  updateSection: (crn: string, updates: Partial<CourseSection>) => void;
  updatePeriod: (
    crn: string,
    periodIndex: number,
    updates: Partial<CourseSectionPeriod>
  ) => void;
  setSelectedCRN: (crn: string | null) => void;
};
export default function SectionModal({
  section,
  updateSection,
  updatePeriod,
  setSelectedCRN
}: PropTypes) {
  const handleChange = (key: string, value: string) => {
    updateSection(section.crn, {
      [key]: value
    });
  };

  function handlePeriodChange(periodIndex: number, key: string, value: any) {
    const p = section.periods[periodIndex];

    if (p.end_time && key === "start_time" && value > p.end_time) {
      return;
    }
    if (p.start_time && key === "end_time" && value < p.start_time) {
      return;
    }

    updatePeriod(section.crn, periodIndex, {
      [key]: value
    });
  }

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
                {section.periods.map((p, periodIndex) => (
                  <tr key={p.days + p.start_time!}>
                    <td>
                      <select
                        defaultValue={p.days.map((d) => d.toString())}
                        onChange={(event) =>
                          handlePeriodChange(
                            periodIndex,
                            "days",
                            Array.from(
                              event.currentTarget.selectedOptions
                            ).map((option) => parseInt(option.value, 10))
                          )
                        }
                        multiple
                      >
                        {dayNames.map((name, day) => (
                          <option key={day} value={day}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="is-capitalized">
                      <select
                        defaultValue={p.type}
                        onChange={(event) =>
                          handlePeriodChange(
                            periodIndex,
                            "type",
                            event.currentTarget.value
                          )
                        }
                      >
                        {[
                          "lecture",
                          "studio",
                          "recitation",
                          "seminar",
                          "lab",
                          "test"
                        ].map((classType) => (
                          <option key={classType} value={classType}>
                            {classType}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="time"
                        defaultValue={p.start_time ?? undefined}
                        max={p.end_time ?? undefined}
                        onChange={(event) =>
                          handlePeriodChange(
                            periodIndex,
                            "start_time",
                            event.currentTarget.value
                          )
                        }
                      />
                      <input
                        type="time"
                        defaultValue={p.end_time ?? undefined}
                        min={p.start_time ?? undefined}
                        onChange={(event) =>
                          handlePeriodChange(
                            periodIndex,
                            "end_time",
                            event.currentTarget.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        defaultValue={p.location}
                        onChange={(event) =>
                          handlePeriodChange(
                            periodIndex,
                            "location",
                            event.currentTarget.value
                          )
                        }
                      />
                    </td>
                    <td>{p.instructors.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}>
                    <button className="button is-small" disabled>
                      Add Section
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
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
