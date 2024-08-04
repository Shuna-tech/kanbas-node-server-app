import * as dao from "./dao.js";
import authenticateUser from "../../authMiddleware.js";
//TODO: add authorization for quizzes related operation

export default function QuizRoutes(app) {
  const updateQuiz = async (req, res) => {
    const { qid } = req.params;
    const quiz = req.body;
    const updatedQuiz = await dao.updateQuiz(qid, quiz);
    res.sendStatus(204);
  };

  const deleteQuiz = async (req, res) => {
    const { qid } = req.params;
    const status = await dao.deleteQuiz(qid);
    res.sendStatus(200);
  };

  const createQuiz = async (req, res) => {
    const { cid } = req.params;
    const courseID = cid;
    console.log("Creating quiz for course: ", courseID);
    const quiz = { ...req.body, courseID };
    console.log("Creating quiz: ", quiz);
    const createdQuiz = await dao.createQuiz(quiz);
    res.send(createdQuiz);
  };

  const findQuizzesForCourse = async (req, res) => {
    const { cid } = req.params;
    //const { user } = req; // TODO: need to include user in the request
    const user = req.session["currentUser"]; // 从 session 中获取用户信息
    //Added more logs more testing
    if (!user) {
      console.error("User not found in request");
      return res.status(500).json({ message: "User not found in request" });
    }

    console.log("User role:", user.role);

    try {
      let quizzes;
      if (user.role === "FACULTY") {
        quizzes = await dao.findQuizzesForCourse(cid);
      } else if (user.role === "STUDENT") {
        quizzes = await dao.findPublishedQuizzesForCourse(cid);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(quizzes);
    } catch (error) {
      console.error("Error finding quizzes for course:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const findQuizById = async (req, res) => {
    const { qid } = req.params;
    console.log("Getting quize for: ", qid);
    const quiz = await dao.findQuizById(qid);
    res.json(quiz);
  };

  const updatePublishStatus = async (req, res) => {
    const { qid } = req.params;
    const { action } = req.query;
    if (!["publish", "unPublish"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const publishStatus = action === "publish";

    try {
      const result = await dao.updateQuiz(qid, { published: publishStatus });
      if (result.nModified === 0) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.sendStatus(204);
    } catch (error) {
      console.error(`Failed to ${action} quiz:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  app.put("/api/quizzes/:qid", updateQuiz);
  app.delete("/api/quizzes/:qid", deleteQuiz);
  app.post("/api/courses/:cid/quizzes", createQuiz);
  //app.get("/api/courses/:cid/quizzes", authenticateUser, findQuizzesForCourse); //TODO: to test with user
  app.get("/api/courses/:cid/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:qid", findQuizById);
  app.put("/api/quizzes/:qid/updatePublishStatus", updatePublishStatus);
}
