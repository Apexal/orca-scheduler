import React from "react";

import googleGuide from "../assets/gcal_guide.gif";

type PropTypes = {
  close: () => void;
};
export default function SectionModal({ close }: PropTypes) {
  const [tab, setTab] = React.useState("google");

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Import Guide</p>
        </header>
        <section className="modal-card-body">
          <div className="tabs">
            <ul>
              <li onClick={() => setTab("google")} className="is-active">
                <a>Google Calendar</a>
              </li>
              <li onClick={() => setTab("apple")}>
                <a>Apple Calendar</a>
              </li>
              <li onClick={() => setTab("outlook")}>
                <a>Outlook</a>
              </li>
            </ul>
          </div>
          {tab === "google" && (
            <div className="google">
              <img src={googleGuide} alt="" />
            </div>
          )}
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={close}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
