import model from "./model.js";
export const createCourse = (course) => {
  delete course._id;
  return model.create(course);
};
export const findAllCourses = () => model.find();
export const updateCourse = (courseId, course) =>
  model.updateOne({ _id: courseId }, { $set: course });
export const deleteCourse = (courseId) => model.deleteOne({ _id: courseId });
export const findCoursesByFaculty = async (facultyId) => {
  try {
    const courses = await model.find({ facultyId });
    return courses;
  } catch (error) {
    console.error("Error fetching courses by faculty:", error);
    throw error;
  }
};
