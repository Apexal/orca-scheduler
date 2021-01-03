import * as React from "react";
import { fetchSemesters, fetchSectionsFromCRNs } from "./services/api";
import { CourseSection, Semester } from "./interfaces";
import { download, generateICSFromSections } from "./services/export";
import { setDifference } from "./utils";
import useNotifications from "./hooks/notifications";
import Calendar from "./components/Calendar";
import SectionList from "./components/SectionList";
import SectionModal from "./components/SectionModal";
import ImportGuideModal from "./components/ImportGuideModal";
import Footer from "./components/Footer";

import "./styles.css";

export default function App() {
  const [isFetching, setIsFetching] = React.useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = React.useState(false);
  const [
    notifications,
    addNotification,
    removeNotification
  ] = useNotifications();
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<
    string | null
  >(null);

  const [sections, setSections] = React.useState<CourseSection[]>([]);
  const [selectedCRN, setSelectedCRN] = React.useState<string | null>(null);

  // Fetch sections from CRNs
  const addSections = (newCRNs: string[]) => {
    if (isFetching || !selectedSemesterId) return;

    // Determine missing CRNS to fetch
    const oldCRNs = sections.map((s) => s.crn);
    newCRNs = Array.from(setDifference(new Set(oldCRNs), new Set(newCRNs)));

    if (newCRNs.length > 0) {
      setIsFetching(true);
      fetchSectionsFromCRNs(selectedSemesterId, newCRNs)
        .then((s) => {
          setSections([...sections, ...s]);
          console.log(newCRNs);
          console.log(s.map((sec) => sec.crn));

          const notFoundCRNS = Array.from(
            setDifference(new Set(s.map((sec) => sec.crn)), new Set(newCRNs))
          );
          if (notFoundCRNS.length > 0) {
            addNotification({
              type: "info",
              message: `Couldn't find sections ${notFoundCRNS.join(", ")}`
            });
          }
        })
        .catch((err) => {
          // Invalid CRNs, don't reset
          addNotification({
            type: "danger",
            message: "Failed to fetch sections."
          });
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  };

  const updateSection = (crn: string, updates: Partial<CourseSection>) => {
    const newSections = sections.map((s) =>
      s.crn === crn ? { ...s, ...updates } : s
    );
    setSections(newSections);
  };

  const removeSection = (crn: string) => {
    setSections(sections.filter((s) => s.crn !== crn));
  };

  const addNewCRNs = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCRNs = event.currentTarget["new-crns"].value
      .trim()
      .split(/\D/)
      .filter((crn: string) => crn.length > 0);

    addSections(newCRNs);
    event.currentTarget["new-crns"].value = "";
  };

  const handleSemesterChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setSelectedSemesterId(event.currentTarget.value);
  };

  // Fetch semesters
  React.useEffect(() => {
    fetchSemesters()
      .then((sems) => {
        setSemesters(sems);
        setSelectedSemesterId(sems[0].semester_id);
      })
      .catch((err) => {
        addNotification({
          type: "danger",
          message: "Failed to fetch semesters!"
        });
        console.error(err);
      });
  }, []);

  // Find section being edited (can be undefined)
  const editingSection = sections.find((s) => s.crn === selectedCRN);

  function exportAsICS() {
    const { error, value } = generateICSFromSections(semesters[0], sections);
    if (error) {
      addNotification({
        type: "danger",
        message: "Failed to download!"
      });
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
                Powered by <strong>ORCA</strong>, the open-source RPI schedule
                API for student projects
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
                updateSection={updateSection}
                setSelectedCRN={setSelectedCRN}
              />
            )}
            {notifications.map((note, index) => (
              <div key={index} className={"notification is-" + note.type}>
                <button
                  className="delete"
                  onClick={() => removeNotification(index)}
                />
                {note.message}
              </div>
            ))}
            <form onSubmit={addNewCRNs} className="mb-5 is-flex">
              <div className="select is-rounded mr-2">
                <select onChange={handleSemesterChange}>
                  {semesters.map((sem) => (
                    <option key={sem.semester_id} value={sem.semester_id}>
                      {sem.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field is-flex-grow-1 has-addons">
                <div
                  className={`control is-expanded ${
                    isFetching ? "is-loading" : ""
                  }`}
                >
                  <input
                    name="new-crns"
                    className="input is-rounded"
                    type="text"
                    placeholder="Type/paste your CRNs here with any separator"
                    minLength={5}
                    required
                  />
                </div>
                <div className="control">
                  <button className="button is-rounded is-success">Add</button>
                </div>
              </div>
            </form>
            {sections.length > 0 && (
              <React.Fragment>
                <hr />
                <div className="columns">
                  <div className="column">
                    <SectionList
                      sections={sections}
                      setSelectedCRN={setSelectedCRN}
                      removeSection={removeSection}
                    />
                  </div>
                  <div className="column">
                    <Calendar sections={sections} />
                  </div>
                </div>

                <div className="buttons mt-5">
                  <button
                    className="button is-large is-rounded is-primary is-fullwidth"
                    disabled={sections.length === 0}
                    onClick={exportAsICS}
                  >
                    Download Schedule
                  </button>
                  <button
                    onClick={() => setIsGuideModalOpen(true)}
                    className="button is-rounded is-fullwidth"
                  >
                    Import Guide for Google/Apple/Outlook Calendar
                  </button>
                </div>
              </React.Fragment>
            )}
          </div>
          {isGuideModalOpen && (
            <ImportGuideModal close={() => setIsGuideModalOpen(false)} />
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
