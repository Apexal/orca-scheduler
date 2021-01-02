import * as React from "react";
import { fetchSemesters, fetchSectionsFromCRNs } from "./api";
import { CourseSection, Semester } from "./interfaces";
import Calendar from "./components/Calendar";
import SectionList from "./components/SectionList";
import SectionModal from "./components/SectionModal";
import "./styles.css";

export default function App() {
  const [crns, setCRNs] = React.useState<string[]>(["40307", "41973"]);
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [sections, setSections] = React.useState<CourseSection[]>([]);
  const [selectedCRN, setSelectedCRN] = React.useState<string | null>(null);

  // Fetch semesters
  React.useEffect(() => {
    fetchSemesters().then(setSemesters);
  }, []);

  // Fetch sections from CRNs
  React.useEffect(() => {
    fetchSectionsFromCRNs("202101", crns).then(setSections);
  }, [crns]);

  // Find section being edited (can be undefined)
  const editingSection = sections.find((s) => s.crn === selectedCRN);

  return (
    <div className="App">
      <header>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">RPI Schedule Calendar Importer</h1>
              <h2 className="subtitle">
                Powered by <strong>ORCA</strong>
              </h2>
            </div>
          </div>
        </section>
      </header>
      <main>
        <section className="section">
          <div className="container">
            {editingSection && (
              <SectionModal
                section={editingSection}
                setSelectedCRN={setSelectedCRN}
              />
            )}
            <form className="mb-5 is-flex">
              <div className="select is-rounded mr-2">
                <select>
                  {semesters.map((sem) => (
                    <option key={sem.semester_id} value={sem.semester_id}>
                      {sem.title}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className="input is-rounded"
                type="text"
                placeholder="Your CRNs from SIS"
              />
              <button
                className="button is-rounded is-danger ml-2"
                type="button"
              >
                Clear
              </button>
            </form>
            <hr />
            <div className="columns">
              <div className="column">
                <SectionList
                  crns={crns}
                  sections={sections}
                  setSelectedCRN={setSelectedCRN}
                />
              </div>
              <div className="column">
                <Calendar sections={sections} />
              </div>
            </div>

            <div className="buttons">
              <button className="button is-rounded is-fullwidth is-primary">
                Import into Google Calendar
              </button>
              <button className="button is-rounded is-primary is-outlined is-fullwidth">
                Export as ICS File
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
