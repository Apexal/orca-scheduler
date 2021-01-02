import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { CourseSection, CourseSectionPeriod } from "../interfaces";

const periodToEvent = (
  section: CourseSection,
  period: CourseSectionPeriod
) => ({
  title: section.course_title + " " + period.type,
  daysOfWeek: period.days,
  startTime: period.start_time,
  endTime: period.end_time
});

type PropTypes = {
  sections: CourseSection[];
};
export default function Calendar({ sections }: PropTypes) {
  const events = sections
    .map((s) => s.periods.map((p) => periodToEvent(s, p)))
    .flat();

  // Sort works because time strings are in standard HH:mm format!
  const sortedTimes = events
    .map((e) => [e.startTime, e.endTime])
    .flat()
    .sort();

  const earliestPeriodStart = sortedTimes[0];
  const latestPeriodEnd = sortedTimes[sortedTimes.length - 1];

  return (
    <div className="calendar">
      <h2 className="title is-size-3">Your Schedule</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={false}
        dayHeaderFormat={{ weekday: "short" }}
        weekends={false}
        allDaySlot={false}
        events={events}
        slotMinTime={earliestPeriodStart ?? "06:00:00"}
        slotMaxTime={latestPeriodEnd ?? "23:00:00"}
        timeZone="America/New_York"
      />
    </div>
  );
}
