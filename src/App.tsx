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
      <div>
        <SectionList crns={crns} sections={sections} />
      </div>
      <div>
        <Calendar sections={sections} />
      </div>
    </div>
  );
}
