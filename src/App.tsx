import * as React from "react";
import { fetchSemesters, fetchSectionsFromCRNs } from "./services/api";
import { CourseSection, Semester } from "./interfaces";
import Calendar from "./components/Calendar";
import SectionList from "./components/SectionList";
import SectionModal from "./components/SectionModal";
import { download, generateICSFromSections } from "./services/export";
import { setEqual } from "./utils";

import "./styles.css";

export default function App() {
  const [crns, setCRNs] = React.useState<string[]>(["44468"]);
  const [isFetching, setIsFetching] = React.useState(false);

  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<
    string | null
  >(null);

  const [sections, setSections] = React.useState<CourseSection[]>([]);
  const [selectedCRN, setSelectedCRN] = React.useState<string | null>(null);

  const updateSection = (crn: string, updates: Partial<CourseSection>) => {
    const newSections = sections.map((s) =>
      s.crn === crn ? { ...s, ...updates } : s
    );
    setSections(newSections);
  };

  const removeSection = (crn: string) => {
    setSections(sections.filter((s) => s.crn !== crn));
  };

  const handleCRNChange = (event: React.FormEvent<HTMLInputElement>) => {
    const newCRNs = event.currentTarget.value
      .trim()
      .split(/\D/)
      .filter((crn) => crn.length > 0);

    if (!setEqual(new Set(newCRNs), new Set(crns))) {
      setCRNs(newCRNs);
    }
  };

  const handleSemesterChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setSelectedSemesterId(event.currentTarget.value);
  };

  // Fetch semesters
  React.useEffect(() => {
    fetchSemesters().then((sems) => {
      setSemesters(sems);
      setSelectedSemesterId(sems[0].semester_id);
    });
  }, []);

  // Fetch sections from CRNs
  React.useEffect(() => {
    if (isFetching || !selectedSemesterId) return;

    setIsFetching(true);

    fetchSectionsFromCRNs(selectedSemesterId, crns)
      .then((s) => {
        setSections(s);
      })
      .catch((err) => {
        // Invalid CRNs, don't reset
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [crns, selectedSemesterId]);

  // Find section being edited (can be undefined)
  const editingSection = sections.find((s) => s.crn === selectedCRN);

  function exportAsICS() {
    const { error, value } = generateICSFromSections(semesters[0], sections);
    if (error) {
      alert(error);
    } else if (value) {
      download(selectedSemesterId + ".ical", value);
    }
  }

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
        <p>{isFetching}</p>
        <section className="section">
          <div className="container">
            {editingSection && (
              <SectionModal
                section={editingSection}
                updateSection={updateSection}
                setSelectedCRN={setSelectedCRN}
              />
            )}
            <form className="mb-5 is-flex">
              <div className="select is-rounded mr-2">
                <select onChange={handleSemesterChange}>
                  {semesters.map((sem) => (
                    <option key={sem.semester_id} value={sem.semester_id}>
                      {sem.title}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className={`control is-flex-grow-1 ${
                  isFetching ? "is-loading" : ""
                }`}
              >
                <input
                  className="input is-rounded"
                  type="text"
                  placeholder="Your CRNs from SIS"
                  onChange={handleCRNChange}
                />
              </div>
            </form>
            <hr />
            <div className="columns">
              <div className="column">
                <SectionList
                  crns={crns}
                  sections={sections}
                  setSelectedCRN={setSelectedCRN}
                  removeSection={removeSection}
                />
              </div>
              <div className="column">
                <Calendar sections={sections} />
              </div>
            </div>

            <div className="buttons">
              <button
                className="button is-rounded is-primary is-fullwidth"
                disabled={sections.length === 0}
                onClick={exportAsICS}
              >
                Export as ICS File
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
