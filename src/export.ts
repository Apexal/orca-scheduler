import { createEvents, EventAttributes } from "ics";
import RRule from "rrule";

import { CourseSection, CourseSectionPeriod, Semester } from "./interfaces";
import {
  dateToRRuleDateArray,
  periodDuration,
  sectionInstructors,
  timeStringToDate
} from "./utils";

const dayRRules = [
  RRule.SU,
  RRule.MO,
  RRule.TU,
  RRule.WE,
  RRule.TH,
  RRule.FR,
  RRule.SA
];

function periodDescription(
  section: CourseSection,
  period: CourseSectionPeriod
) {
  const duration = periodDuration(period);

  const lines = [
    `${duration.hours}h ${duration.minutes} ${period.type} period`,
    "",
    `<b>CRN</b> ${section.crn}`,
    `<b>Section</b> ${section.section_id}`,
    `<b>Credits</b> ${section.credits.join("/")}`,
    `<b>Section</b> ${section.section_id}`,
    `<b>Instructors</b> ${sectionInstructors(section).join(", ")}`,
    "",
    `<i>${section.instruction_method}</i>`
  ];

  return lines.join("\n");
}

function periodToICALEvent(
  startDate: Date,
  endDate: Date,
  section: CourseSection,
  period: CourseSectionPeriod
): EventAttributes {
  // Generate proper recurrence rule for this period
  const start = timeStringToDate(startDate, period.start_time);
  const end = timeStringToDate(startDate, period.end_time);

  const lastDateTime = timeStringToDate(endDate, period.end_time);
  const rule = new RRule({
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: period.days.map((d) => dayRRules[d]),
    until: lastDateTime
  });

  return {
    start: dateToRRuleDateArray(start),
    end: dateToRRuleDateArray(end),
    title: section.course_title + " " + period.type,
    location: period.location,
    description: periodDescription(section, period),
    recurrenceRule: rule.toString().replace("RRULE:", "")
  };
}

export function generateICSFromSections(
  semester: Semester,
  sections: CourseSection[]
) {
  const semesterStartDate = new Date(semester.end_date);
  const semesterEndDate = new Date(semester.start_date);

  const events = sections
    .map((section) =>
      section.periods.map((period) =>
        periodToICALEvent(semesterStartDate, semesterEndDate, section, period)
      )
    )
    .flat();
  return createEvents(events);
}
