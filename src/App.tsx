import * as React from "react";
import { fetchSectionsFromCRNs } from "./api";
import { CourseSection } from "./interfaces";
import Calendar from "./components/Calendar";
import SectionList from "./components/SectionList";
import "./styles.css";

export default function App() {
  const [crns, setCRNs] = React.useState<string[]>(["40307", "41973"]);
  const [sections, setSections] = React.useState<CourseSection[]>([]);
  React.useEffect(() => {
    fetchSectionsFromCRNs("202101", crns).then(setSections);
  }, [crns]);

  return (
    <div className="App">
      <main>
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column">
                <SectionList crns={crns} sections={sections} />
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
