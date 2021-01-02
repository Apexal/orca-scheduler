import * as React from "react";
import { fetchSectionsFromCRNs } from "./api";
import { CourseSection } from "./interfaces";
import Calendar from "./components/Calendar";
import SectionList from "./components/SectionList";
import SectionModal from "./components/SectionModal";
import "./styles.css";

export default function App() {
  const [crns, setCRNs] = React.useState<string[]>(["40307", "41973"]);
  const [sections, setSections] = React.useState<CourseSection[]>([]);
  const [selectedCRN, setSelectedCRN] = React.useState<string | null>(null);
  React.useEffect(() => {
    fetchSectionsFromCRNs("202101", crns).then(setSections);
  }, [crns]);

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
          </div>
        </section>
      </main>
    </div>
  );
}
