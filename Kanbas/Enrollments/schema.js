import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      ref: "UserModel",
      required: true,
    },
    course: {
      type: String,
      ref: "CourseModel",
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "enrollments" }
);

export default enrollmentSchema;
