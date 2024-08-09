import mongoose from "mongoose";
import quizResultSchema from "./quizResultSchema.js";
const quizResultModel = mongoose.model("QuizResultModel", quizResultSchema);
export default quizResultModel;
