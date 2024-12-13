import mongoose, { ObjectId, PopulatedDoc } from "mongoose";
import { ExamInterface } from "./Exam";
import { StudentCourse } from "./User";

import "./Exam";

export const isCourseYear = (year: string): year is CourseYear =>
  ["LT1", "LT2", "LT3", "LT4", "LT5", "LT6"].includes(year);

export type CourseYear = Exclude<StudentCourse, "LTn">;

export interface CourseInterface {
  name: string;
  code?: string;
  year: CourseYear;
  exams: PopulatedDoc<ExamInterface>[];
}

const courseSchema = new mongoose.Schema<CourseInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      enum: ["LT1", "LT2", "LT3", "LT4", "LT5", "LT6"],
      required: true,
    },
    code: {
      type: String,
      required: false,
    },
    exams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.models.Course ||
  mongoose.model<CourseInterface>("Course", courseSchema);
