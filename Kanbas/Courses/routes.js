import Database from "../Database/index.js";
import * as dao from "./dao.js";
import * as enrollmentDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const fetchAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  };

  const updateCourse = async (req, res) => {
    const { id } = req.params;
    const course = req.body;
    const updatedCourse = await dao.updateCourse(id, course);
    res.sendStatus(204);
  };

  const deleteCourse = async (req, res) => {
    const { id } = req.params;
    // const status = await dao.deleteCourse(id);
    // res.sendStatus(204);
    try {
      await dao.deleteCourse(id);
      await enrollmentDao.deleteEnrollmentsByCourse(id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting course and enrollments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const createCourse = async (req, res) => {
    console.log("creating new course: ", req.body);
    const { facultyId } = req.params;
    const courseData = req.body;
    const course = { ...courseData, facultyId };
    const createdCourse = await dao.createCourse(course);
    console.log("created  course: ", createdCourse);
    res.send(createdCourse);
  };

  //Fetch courses by Faculty
  const fetchCoursesByFaculty = async (req, res) => {
    const { facultyId } = req.params;
    const courses = await dao.findCoursesByFaculty(facultyId);
    res.json(courses);
  };

  app.get("/api/courses", fetchAllCourses);
  app.put("/api/courses/:id", updateCourse);
  app.delete("/api/courses/:id", deleteCourse);
  app.post("/api/courses/:facultyId", createCourse);
  app.get("/api/courses/faculty/:facultyId", fetchCoursesByFaculty);
}
