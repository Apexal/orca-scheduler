export interface Semester {
  semester_id: string;
  title: string;
  start_date: string;
  end_date: string;
}

export interface CourseSection {
  crn: string;
  periods: CourseSectionPeriod[];
  [key: string]: any;
}

export interface CourseSectionPeriod {
  instructors: string[];
  days: number[];
  [key: string]: any;
}
