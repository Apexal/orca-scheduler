import { DateArray } from "ics";
import {
  setHours,
  setMinutes,
  toDate,
  intervalToDuration,
  addDays
} from "date-fns";
import { CourseSection, CourseSectionPeriod } from "./interfaces";

export function timeStringToDate(date: Date, timeStr: string) {
  let [hours, minutes] = timeStr.split(":").map((p) => parseInt(p, 10));

  date = toDate(date);
  date = setHours(date, hours);
  date = setMinutes(date, minutes);

  return date;
}

export function dateToRRuleDateArray(date: Date): DateArray {
  return [
    date.getFullYear(),
    date.getMonth() + 1, // This is 0-indexed for some reason
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  ];
}

export function sectionInstructors(section: CourseSection) {
  return Array.from(new Set(section.periods.map((p) => p.instructors).flat()));
}

export function periodDuration(period: CourseSectionPeriod) {
  const interval = {
    start: timeStringToDate(new Date(), period.start_time),
    end: timeStringToDate(new Date(), period.end_time)
  };
  return intervalToDuration(interval);
}

export function setEqual(a: Set<any>, b: Set<any>) {
  return a.size === b.size && Array.from(a).every((value) => b.has(value));
}

export function firstDayAferDate(startDate: Date, days: number[]): Date {
  let daysSet = new Set(days);
  let date = toDate(startDate);
  while (!daysSet.has(date.getDay())) {
    date = addDays(date, 1);
  }
  return date;
}

export const capitalize = (str: string) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
