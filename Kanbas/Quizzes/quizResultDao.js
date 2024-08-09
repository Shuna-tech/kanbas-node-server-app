import quizResultModel from "./quizResultModel.js";

export const createQuizResult = (quizResult) => {
  return quizResultModel.create(quizResult);
};

export const findQuizResultsForUser = (userId) => {
  return quizResultModel.find({ userId });
};

export const findQuizResultById = (resultId) => {
  return quizResultModel.findById(resultId);
};

export const findQuizResultsForQuiz = (quizId) => {
  return quizResultModel.find({ quizId });
};

export const findQuizResultForUserAndQuiz = (userId, quizId) => {
  return quizResultModel.findOne({ userId, quizId });
};

export const updateQuizResult = (userId, quizId, resultData) => {
  return quizResultModel.findOneAndUpdate(
    { userId, quizId },
    { $set: resultData },
    { new: true, runValidators: true }
  );
};