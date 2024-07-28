import mongoose from 'mongoose';

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String},
  module: { type: String, required: true }
});

// Module Schema
const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String},
  course: { type: String, required: true },
  lessons: [lessonSchema]
}, 
{ collection: "modules" }
);

export default moduleSchema;
