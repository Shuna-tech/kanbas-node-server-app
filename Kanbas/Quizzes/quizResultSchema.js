import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const quizResultSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "UserModel",
      required: true,
    },
    quizId: {
      type: String,
      ref: "QuizModel",
      required: true,
    },
    answers: [answerSchema],
    totalScore: {
      type: Number,
      default: 0,
    },
    attemptNumber: {
      type: Number,
      default: 0,
    },
  },
  { collection: "quizResults" }
);

export default quizResultSchema;
