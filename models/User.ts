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

const studentCourses: StudentCourse[] = [
  "LT1",
  "LT2",
  "LT3",
  "LT4",
  "LT5",
  "LT6",
  "LTn",
];

export const isStudentCourse = (course: unknown): course is StudentCourse =>
  typeof course === "string" &&
  studentCourses.includes(course as StudentCourse);

export interface UserInterface {
  name: string;
  course: UserCourse;
  phoneNumber: string | null;
  email: string;
  visible: boolean;
}

export type ApiUser = Omit<UserInterface, "course"> & {
  id: string;
};

export type UserModel = mongoose.Model<UserInterface>;

const userSchema = new mongoose.Schema<UserInterface>({
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
});

// TO Json
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

userSchema.index({ name: "text" });

export default (mongoose.models.Entry as mongoose.Model<UserInterface>) ||
  mongoose.model<UserInterface>("Entry", userSchema);
