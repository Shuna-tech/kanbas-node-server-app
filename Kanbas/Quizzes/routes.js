import * as dao from "./dao.js";
import * as resultDao from "./quizResultDao.js";
//TODO: add authorization for quizzes related operation
export default function QuizRoutes(app) {
  //Update quiz
  const updateQuiz = async (req, res) => {
    const { qid } = req.params;
    const quiz = req.body;
    const updatedQuiz = await dao.updateQuiz(qid, quiz);
    res.sendStatus(204);
  };

  //Delete Quiz
  const deleteQuiz = async (req, res) => {
    const { qid } = req.params;
    const status = await dao.deleteQuiz(qid);
    res.sendStatus(200);
  };

  //Create quiz
  const createQuiz = async (req, res) => {
    const { cid } = req.params;
    const courseID = cid;
    console.log("Creating quiz for course: ", courseID);
    const quiz = { ...req.body, courseID };
    console.log("Creating quiz: ", quiz);
    const createdQuiz = await dao.createQuiz(quiz);
    res.send(createdQuiz);
  };

  //Find all quizzes under one course
  const findQuizzesForCourse = async (req, res) => {
    const { cid } = req.params;
    const { user } = req;
    try {
      let quizzes;
      console.log("Retriving quiz for: ", cid);
      quizzes = await dao.findQuizzesForCourse(cid);
      console.log("Retried quiz: ", quizzes);
      res.json(quizzes);
    } catch (error) {
      console.error("Error finding quizzes for course:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  //Find quiz by id
  const findQuizById = async (req, res) => {
    const { qid } = req.params;
    const quiz = await dao.findQuizById(qid);
    res.json(quiz);
  };

  //Update the status of publish
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

  //Preview the quiz
  const previewQuiz = async (req, res) => {
    const { qid } = req.params;
    try {
      const quiz = await dao.findQuizById(qid);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json({ message: "Quiz preview", quiz });
    } catch (error) {
      console.error("Error fetching quiz preview:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  //Edit the quiz
  const editQuiz = async (req, res) => {
    const { qid } = req.params;
    try {
      const result = await dao.updateQuiz(qid, req.body);
      if (result.nModified === 0) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.sendStatus(204);
    } catch (error) {
      console.error("Error editing quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  //Save and publish the quiz (different from update the publish status)
  const publishQuiz = async (req, res) => {
    const { qid } = req.params;
    try {
      const publishedQuiz = await dao.publishQuiz(qid);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error publishing quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

// Create or update quiz result
const createOrUpdateQuizResult = async (req, res) => {
  const { userId, quizId } = req.body;
  const resultData = req.body;

  try {
    const existingResult = await resultDao.findQuizResultForUserAndQuiz(userId, quizId);
    if (existingResult) {
      // Update existing result
      const updatedResult = await resultDao.updateQuizResult(userId, quizId, resultData);
      res.json(updatedResult);
    } else {
      // Create new result
      const newResult = await resultDao.createQuizResult(resultData);
      res.json(newResult);
    }
  } catch (error) {
    console.error("Failed to create or update quiz result:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

  // Get quiz results for a user
  const findQuizResultsForUser = async (req, res) => {
    const { uid } = req.params;
    try {
      const results = await resultDao.findQuizResultsForUser(uid);
      res.json(results);
    } catch (error) {
      console.error("Failed to retrieve quiz results for user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get quiz result by ID
  const findQuizResultById = async (req, res) => {
    const { rid } = req.params;
    try {
      const result = await resultDao.findQuizResultById(rid);
      res.json(result);
    } catch (error) {
      console.error("Failed to retrieve quiz result:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get quiz results for a quiz
  const findQuizResultsForQuiz = async (req, res) => {
    const { qid } = req.params;
    try {
      const results = await resultDao.findQuizResultsForQuiz(qid);
      res.json(results);
    } catch (error) {
      console.error("Failed to retrieve quiz results for quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get quiz result for a specific user and quiz
  const findQuizResultForUserAndQuiz = async (req, res) => {
    const { uid, qid } = req.params;
    try {
      const result = await resultDao.findQuizResultForUserAndQuiz(uid, qid);
      if (!result) {
        return res.status(404).json({ message: "Quiz result not found" });
      }
      res.json(result);
    } catch (error) {
      console.error("Failed to retrieve quiz result for user and quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  //TODO: Submit the quiz

  app.put("/api/quizzes/:qid", updateQuiz);
  app.delete("/api/quizzes/:qid", deleteQuiz);
  app.post("/api/courses/:cid/quizzes", createQuiz);
  app.get("/api/courses/:cid/quizzes", findQuizzesForCourse); //TODO: to test with user
  app.get("/api/quizzes/:qid", findQuizById);
  app.put("/api/quizzes/:qid/updatePublishStatus", updatePublishStatus);
  app.get("/api/quizzes/:qid/preview", previewQuiz);
  app.put("/api/quizzes/:qid/edit", editQuiz);
  app.put("/api/quizzes/:qid/publish", publishQuiz);
  // Added some new apis for quiz results
  app.post("/api/quizResults", createOrUpdateQuizResult);
  app.get("/api/users/:uid/quizResults", findQuizResultsForUser);
  app.get("/api/quizResults/:rid", findQuizResultById);
  app.get("/api/quizzes/:qid/quizResults", findQuizResultsForQuiz);
  app.get("/api/users/:uid/quizzes/:qid/result", findQuizResultForUserAndQuiz);
}
