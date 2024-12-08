import mongoose from "mongoose";

export type UserCourse =
  | "LT1"
  | "LT2"
  | "LT3"
  | "LT4"
  | "LT5"
  | "LT6"
  | "LTn"
  | "alumni";

export type StudentCourse = Exclude<UserCourse, "alumni">;

export const isStudentCourse = (course: unknown): course is StudentCourse =>
  typeof course === "string" &&
  ["LT1", "LT2", "LT3", "LT4", "LT5", "LT6", "LTn"].includes(course);

export interface UserInterface {
  name: string;
  course: UserCourse;
  phoneNumber: string | null;
  email: string;
  visible: boolean;
}

export type UserModel = mongoose.Model<UserInterface>;

const userSchema = new mongoose.Schema<UserInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      enum: ["LT1", "LT2", "LT3", "LT4", "LT5", "LT6", "LTn", "alumni"],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
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

userSchema.index({ name: "text" });

export default mongoose.models.Entry ||
  mongoose.model<UserInterface>("Entry", userSchema);
