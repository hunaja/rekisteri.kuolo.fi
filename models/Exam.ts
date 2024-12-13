import mongoose, { PopulatedDoc, Schema } from "mongoose";

import "./Course";
import { ApiCourse, CourseInterface } from "./Course";

export interface ExamInterface {
  course: PopulatedDoc<CourseInterface>;
  year: number | null;
  description: string;
  visible: boolean;
  fileMimeType: string;
  fileSize: number;
  fileName: string;
}

export type ApiExam = Omit<ExamInterface, "course"> & {
  course: string;
  id: string;
};

export type ApiExamPopulated = Omit<ApiExam, "course"> & {
  course: ApiCourse;
};

export type ExamDocument = mongoose.Document & ExamInterface;

const examSchema = new Schema<ExamInterface>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    year: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    fileName: {
      type: String,
      required: false,
    },
    fileMimeType: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Exam =
  (mongoose.models.Exam as mongoose.Model<ExamInterface>) ||
  mongoose.model<ExamInterface>("Exam", examSchema);

export default Exam;
