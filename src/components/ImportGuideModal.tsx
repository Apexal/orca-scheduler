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
              {["google", "apple", "outlook"].map((service) => (
                <li
                  onClick={() => setTab(service)}
                  className={
                    "is-capitalized " + (service === tab ? "is-active" : "")
                  }
                >
                  <a href="#">{service} Calendar</a>
                </li>
              ))}
            </ul>
          </div>
          {tab === "google" && (
            <div className="google">
              <img src={googleGuide} alt="" />
            </div>
          )}
          {tab === "apple" && (
            <div className="apple">
              <p>
                <a
                  href="https://openicsfile.com/apple.html"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  On Mac
                </a>
              </p>
              <p>
                <a href=""></a>
              </p>
            </div>
          )}
          {tab === "outlook" && (
            <a href="https://support.microsoft.com/en-us/office/import-calendars-into-outlook-8e8364e1-400e-4c0f-a573-fe76b5a2d379">
              Microsoft Support
            </a>
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
