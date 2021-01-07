export interface Semester {
  semester_id: string;
  title: string;
  start_date: string;
  end_date: string;
}

export interface CourseSection {
  semester_id: string;
  section_id: string;
  crn: string;
  course_title: string;
  course_subject_prefix: string;
  course_number: string;
  credits: number[];
  instruction_method: string | null;
  periods: CourseSectionPeriod[];
  // [key: string]: any;
}

export interface CourseSectionPeriod {
  days: number[];
  start_time: string | null;
  end_time: string | null;
  instructors: string[];
  [key: string]: any;
}

export interface ValidCourseSectionPeriod extends CourseSectionPeriod {
  start_time: string;
  end_time: string;
}

export interface Notification {
  type: "danger" | "success" | "info";
  message: string;
}
