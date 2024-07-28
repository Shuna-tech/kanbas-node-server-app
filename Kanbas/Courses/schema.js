import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  number: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  department: {
    type: String,
    trim: true
  },
  credits: {
    type: Number,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
  }
}, 
{ collection: "courses" });

export default courseSchema;