import mongoose from "mongoose";

export interface UserInterface {
  name: string;
  course: string;
  phoneNumber: string;
  email: string;
  visible: boolean;
  phoneNumberVisible: boolean;
}

const userSchema = new mongoose.Schema<UserInterface>(
  {
    name: String,
    course: String,
    phoneNumber: String,
    email: String,
    visible: Boolean,
    phoneNumberVisible: Boolean,
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
