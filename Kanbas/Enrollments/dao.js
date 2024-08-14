import EnrollmentModel from "./model.js";

export const findEnrollmentsForStudent = (studentId) =>
  EnrollmentModel.find({ student: studentId }).populate("course");

export const enrollStudentInCourse = (enrollment) =>
  EnrollmentModel.create(enrollment);

export const findEnrollment = (studentId, courseId) =>
  EnrollmentModel.findOne({ student: studentId, course: courseId });

export const unenrollStudentFromCourse = (studentId, courseId) =>
  EnrollmentModel.deleteOne({ student: studentId, course: courseId });

// Deleting enrollements when a course is deleted
export const deleteEnrollmentsByCourse = async (courseId) => {
  return EnrollmentModel.deleteMany({ course: courseId });
};
