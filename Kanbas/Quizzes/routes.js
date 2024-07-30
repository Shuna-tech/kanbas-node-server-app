import * as dao from "./dao.js";

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
    const quiz = { ...req.body, courseID};
    console.log("Creating quiz: ", quiz);
    const createdQuiz = await dao.createQuiz(quiz);
    res.send(createdQuiz);
  };

  //Find all quizzes under one course
  const findQuizzesForCourse = async (req, res) => {
    const { cid } = req.params;
    const { user } = req; // TODO: need to include user in the request
    try {
      let quizzes;
      if (user.role === 'FACULTY') {
        quizzes = await dao.findQuizzesForCourse(cid);
      } else if (user.role === 'STUDENT') {
        quizzes = await dao.findPublishedQuizzesForCourse(cid);
      } else {
        return res.status(403).json({ message: 'Access denied' });
      }
      res.json(quizzes);
    } catch (error) {
      console.error('Error finding quizzes for course:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  //Find quiz by id
  const findQuizById = async (req, res) => {
    const {qid} = req.params;
    console.log("Getting quize for: ", qid);
    const quiz = await dao.findQuizById(qid);
    res.json(quiz);
  }

  //Update the status of publish
  const updatePublishStatus = async (req, res) => {
    const { qid } = req.params;
    const { action } = req.query;
    if (!['publish', 'unPublish'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }
    const publishStatus = action === 'publish';
    try {
      const result = await dao.updateQuiz(qid, { published: publishStatus });
      if (result.nModified === 0) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.sendStatus(204);
    } catch (error) {
      console.error(`Failed to ${action} quiz:`, error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  //Preview the quiz
  const previewQuiz = async (req, res) => {
    const {qid} = req.params;
    try {
      const quiz = await dao.findQuizById(qid);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.json({ message: 'Quiz preview', quiz });
    } catch (error) {
      console.error('Error fetching quiz preview:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  //Edit the quiz
  const editQuiz = async (req, res) => {
    const {qid} = req.params;
    try {
      const result = await dao.updateQuiz(qid, req.body);
      if (result.nModified === 0) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.sendStatus(204);
    } catch (error) {
      console.error('Error editing quiz:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  //Add questions to quiz
  const addQuestions = async (req, res) => {
    try {
      const { qid } = req.params;
      const question = req.body;
      const quiz = await dao.findQuizById(qid);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      quiz.questions.push(question);
      await quiz.save();
      res.status(201).json(question);
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  //Update Questions in quiz
  const updateQuestionsNoChoices = async (req, res) => {
    const { qid, questionId } = req.params;
    const updateData = req.body;
    try {
      const quiz = await dao.findQuizById(qid);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      console.log("questionId: ", questionId)
      const question = quiz.questions.id(questionId);
      console.log("question: ", question);
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
      question.set(updateData);
      console.log("uodated question: ", question)
      await quiz.save();
      res.status(204).send();
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

/*TODO
deleteQuestions: app.delete("api/quizzes/:qid/questions/:questionId)
updateChoices: app.put("/api/quizzes/:qid/questions/:questionId/choices/choiceId")
addChoices: app.post("/api/quizzes/:qid/questions/:questionId/choices")
deleteChoices: app.delete("api/quizzes/:qid/questions/:questionId/choices/choiceId") */

  app.put("/api/quizzes/:qid", updateQuiz);
  app.delete("/api/quizzes/:qid", deleteQuiz);
  app.post("/api/courses/:cid/quizzes", createQuiz);
  app.get("/api/courses/:cid/quizzes", findQuizzesForCourse); //TODO: to test with user
  app.get("/api/quizzes/:qid", findQuizById);
  app.put("/api/quizzes/:qid/updatePublishStatus", updatePublishStatus);
  app.get("/api/quizzes/:qid/preview", previewQuiz);
  app.put("/api/quizzes/:qid/edit", editQuiz)
  app.post("/api/quizzes/:qid/questions", addQuestions);
  app.put("/api/quizzes/:qid/questions/:questionId", updateQuestionsNoChoices);
}
