import model from "./model.js";
export const createQuiz = (quiz) => {
  delete quiz._id
  return model.create(quiz);
} 
export const findQuizzesForCourse = async (courseId) => {
  try{
    const quizzes = await model.find({course: courseId});
    return quizzes;
  }catch (error) {
    console.error("Failed to retrieve quizzes:", error);
    throw error;
  }
};
export const findPublishedQuizzesForCourse = async (courseId) => {
  try {
    const quizzes = await model.find({ course: courseId, published: true });
    return quizzes;
  } catch (error) {
    console.error("Failed to retrieve published quizzes:", error);
    throw error;
  }
};
export const updateQuiz = (quizId, quiz) =>  model.updateOne({ _id: quizId }, { $set: quiz });
export const deleteQuiz = (quizId) => model.deleteOne({ _id: quizId });
export const findQuizById = (quizId) => model.findById(quizId)