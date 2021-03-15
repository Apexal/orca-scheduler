import ical, { day } from "ical-generator";

import {
  CourseSection,
  CourseSectionPeriod,
  Semester,
  ValidCourseSectionPeriod
} from "../interfaces";
import {
  capitalize,
  firstDayAferDate,
  periodDuration,
  sectionInstructors,
  timeStringToDate
} from "../utils";

//Must be day array type
let dayRRules: day[] = [
  'SU',
  'MO',
  'TU',
  'WE',
  'TH',
  'FR',
  'SA'
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
  //Declare ical and timezone
  const cal = ical({
    timezone: "America/New_York"
  });

  //Loop through all periods. Not sure if there is a better way about this.
  sections.forEach(function (section) {
    section.periods.forEach(function (period) {
      //Use same filter periods function on each period
      if(filterIncompletePeriods(period)){
        var startDate = firstDayAferDate(semesterStartDate, period.days);
        cal.createEvent({
          start: timeStringToDate(startDate, period.start_time || ''),
          end: timeStringToDate(startDate, period.end_time || ''),
          summary: section.course_title + " " + capitalize(period.type),
          repeating: {
            freq: "WEEKLY",
            byDay: period.days.map((d) => dayRRules[d]),
            until: semesterEndDate
          },
          description: periodDescription(section, period),
          location: period.location,
          timezone: "America/New_York" //Choose same timezone again so resolve DST issues
        });
      }
      
    });
    
  });

  return cal.toString();
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
