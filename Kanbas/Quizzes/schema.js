import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  courseID:{
    type: String,
    required: true
  },
  published:{
    type: Boolean,
    required: true
  },
  availableDate: {
    type: Date,
    required: true
  },
  availableUntilDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date
  },
  points: {
    type: Number,
    min: 0
  },
  questions: {
    type: Number,
    min: 0
  },
  score: {
    type: Number,
    min: 0
  }
}, 
{ collection: "quizzes"}
);

export default quizSchema;