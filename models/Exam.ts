import mongoose, { PopulatedDoc, Schema, model } from "mongoose";

import "./Course";
import { CourseInterface } from "./Course";

export interface ExamInterface {
  course: PopulatedDoc<CourseInterface>;
  year: number | null;
  description: string;
  visible: boolean;
  fileMimeType: string;
  fileSize: number;
  fileName: string;
}

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
