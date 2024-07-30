import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionTitle: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['True/False', 'Multiple Choice', 'Fill in Multiple Blanks'],
    default: 'Multiple Choice'
  },
  points: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  question: {
    type: String,
    required: true
  },
  choices: [{
    optionText: String,
    correct: { type: Boolean, default: false }
  }]
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: 'New Quiz'
  },
  courseID:{
    type: String,
    required: true
  },
  description:{
    type: String
  },
  questions: [questionSchema],
  published:{
    type: Boolean,
    default: false
  },
  quizType: {
    type: String,
    enum: ['Graded Quiz', 'Practice Quiz', 'Graded Survey', 'Ungraded Survey'],
    default: 'Graded Quiz'
  },
  points: {
    type: Number,
    min: 0,
    default: 0
  },
  assignmentGroup: {
    type: String,
    enum: ['Quizzes', 'Exams', 'Assignments', 'Project'],
    default: 'Quizzes'
  },
  shuffleAnswers: {
    type: Boolean,
    default: true
  },
  timeLimit: {
    type: Number,
    default: 20 // in minutes
  },
  multipleAttempts: {
    type: Boolean,
    default: false
  },
  howManyAttempts: {
    type: Number,
    default: 1
  },
  showCorrectAnswers: {
    type: String,
    default: ''
  },
  accessCode: {
    type: String,
    default: ''
  },
  oneQuestionAtATime: {
    type: Boolean,
    default: true
  },
  webcamRequired: {
    type: Boolean,
    default: false
  },
  lockQuestionsAfterAnswering: {
    type: Boolean,
    default: false
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
  totalPoints: {
    type: Number,
    min: 0
  },
  score: {
    type: Number,
    min: 0
  }
}, 
{ collection: "quizzes" }
);

export default quizSchema;