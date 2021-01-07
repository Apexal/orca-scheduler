import { createEvents, EventAttributes } from "ics";
import RRule from "rrule";

import {
  CourseSection,
  CourseSectionPeriod,
  Semester,
  ValidCourseSectionPeriod
} from "../interfaces";
import {
  capitalize,
  dateToRRuleDateArray,
  firstDayAferDate,
  periodDuration,
  sectionInstructors,
  timeStringToDate
} from "../utils";

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
    `<b>[${section.course_title} - ${section.course_subject_prefix} ${section.course_number}]</b>`,
    `<i>${duration.hours}h ${duration.minutes} ${period.type} period</i>`,
    `<i>${section.instruction_method}</i>`,
    "",
    `<b>CRN</b> ${section.crn}`,
    `<b>Section</b> ${section.section_id}`,
    `<b>Credits</b> ${section.credits.join("/")}`,
    `<b>Section</b> ${section.section_id}`,
    `<b>Instructors</b> ${sectionInstructors(section).join(", ")}`
  ];

  return lines.join("\n");
}

function periodToICALEvent(
  startDate: Date,
  endDate: Date,
  section: CourseSection,
  period: ValidCourseSectionPeriod
): EventAttributes {
  // Generate proper recurrence rule for this period
  startDate = firstDayAferDate(startDate, period.days);
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
    title: section.course_title + " " + capitalize(period.type),
    location: period.location,
    description: periodDescription(section, period),
    recurrenceRule: rule.toString().replace("RRULE:", "")
  };
}

function filterIncompletePeriods(period: CourseSectionPeriod) {
  if (period.days.length === 0 || !period.start_time || !period.end_time) {
    return false;
  }
  return true;
}

export function generateICSFromSections(
  semester: Semester,
  sections: CourseSection[]
) {
  const semesterStartDate = new Date(semester.start_date);
  const semesterEndDate = new Date(semester.end_date);

  const events = sections
    .map((section) =>
      section.periods
        .filter(filterIncompletePeriods)
        .map((period) =>
          periodToICALEvent(
            semesterStartDate,
            semesterEndDate,
            section,
            period as ValidCourseSectionPeriod
          )
        )
    )
    .flat();
  return createEvents(events);
}

export function download(filename: string, text: string) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
