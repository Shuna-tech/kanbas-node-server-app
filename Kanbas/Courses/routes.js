import Database from "../Database/index.js";
import * as dao from "./dao.js";

export default function CourseRoutes(app) {
  const fetchAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses)
  }

  const updateCourse = async (req, res) => {
    const { id } = req.params;
    const course = req.body;
    const updatedCourse = await dao.updateCourse(id, course);
    res.sendStatus(204);
  };
  
  const deleteCourse = async (req, res) => {
    const { id } = req.params;
    const status = await dao.deleteCourse(id);
    res.sendStatus(204);
  };

  const createCourse = async (req, res) => {
    console.log("creating new course: ", req.body)
    const course = { ...req.body};
    const createdCourse = await dao.createCourse(course);
    console.log("created  course: ", createdCourse)
    res.send(createdCourse);
  };

  app.get("/api/courses", fetchAllCourses);
  app.put("/api/courses/:id", updateCourse);
  app.delete("/api/courses/:id", deleteCourse);
  app.post("/api/courses", createCourse)

}
