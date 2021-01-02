export interface CourseSection {
  crn: string;
  periods: CourseSectionPeriod[];
  [key: string]: any;
}

export interface CourseSectionPeriod {
  instructors: string[];
  [key: string]: any;
}
