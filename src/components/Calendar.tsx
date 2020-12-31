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

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="timeGridWeek"
      weekends={false}
      allDaySlot={false}
      events={events}
      slotMinTime="08:00:00"
      slotMaxTime="22:00:00"
      timeZone="America/New_York"
    />
  );
}
