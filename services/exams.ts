import connectMinio, { bucketPrefix } from "@/connectMinio";
import connectMongo from "@/connectMongo";
import Course from "@/models/Course";
import Exam, { ApiExam, ApiExamPopulated, ExamInterface } from "@/models/Exam";
import mime from "mime-types";
import { ObjectId } from "mongoose";

type SentFile = {
  name: string;
  size: number;
};

export type ExamForm = Omit<
  ExamInterface,
  "course" | "fileName" | "fileSize" | "fileMimeType" | "visible"
> & {
  courseId: string;
  file: SentFile;
};

const getAllInvisible = async (): Promise<ApiExamPopulated[]> => {
  await connectMongo();

  const exams = await Exam.find({ visible: false }).populate("course");

  const jsonExams = exams.map((e) => {
    const jsonExam = e.toJSON();

    return {
      ...jsonExam,
      course: {
        // @ts-expect-error mongoose types are not perfect
        id: jsonExam.course!.id.toString(), // @ts-expect-error mongoose types are not perfect
        name: jsonExam.course!.name, // @ts-expect-error mongoose types are not perfect
        code: jsonExam.course!.code, // @ts-expect-error mongoose types are not perfect
        year: jsonExam.course!.year,
        exams: [],
      },
    };
  });

  // @ts-expect-error mongoose types are not perfect
  return jsonExams;
};

const deleteExam = async (examId: string): Promise<void> => {
  await connectMongo();

  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new Error("Exam not found");
  }

  const course = await Course.findById(exam.course);
  if (!course) {
    throw new Error("Course not found");
  }

  // @ts-expect-error mongoose types are not perfect
  course.exams = course.exams.filter((e: ObjectId) => e.toString() !== examId);
  await course.save();

  await Exam.findByIdAndDelete(examId);
};

const createExam = async (
  examForm: ExamForm
): Promise<ExamInterface & { uploadUrl: string }> => {
  await connectMongo();
  const client = await connectMinio();

  const bucketName = bucketPrefix + "exams";

  const course = await Course.findById(examForm.courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  const fileMimeType = mime.contentType(examForm.file.name);
  if (!fileMimeType) {
    throw new Error("Invalid file type");
  }
  const fileExtension = mime.extension(fileMimeType);

  const exam = new Exam({
    course: course._id,
    year: examForm.year,
    description: examForm.description,
    visible: false,
    fileMimeType,
    fileSize: examForm.file.size,
  });
  const savedExam = await exam.save();

  savedExam.fileName = savedExam._id.toString() + "." + fileExtension;
  await savedExam.save();

  course.exams.push(savedExam._id);
  await course.save();

  const uploadUrl = await client.presignedPutObject(
    bucketName,
    savedExam.fileName,
    24 * 60 * 60
  );

  return {
    ...savedExam.toJSON(),
    uploadUrl,
  };
};

async function changeVisibility(
  id: string,
  visible: boolean
): Promise<ApiExam | null> {
  await connectMongo();

  const exam = await Exam.findById(id);
  if (!exam) {
    return null;
  }
  exam.visible = visible;
  await exam.save();

  return exam.toJSON();
}

const getExamDownloadUrl = async (examId: string): Promise<string> => {
  await connectMongo();
  const client = await connectMinio();

  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new Error("Exam not found");
  }

  const bucketName = bucketPrefix + "exams";
  const fileUrl = await client.presignedGetObject(
    bucketName,
    exam.fileName,
    24 * 60 * 60
  );

  return fileUrl;
};

const examsService = {
  getAllInvisible,
  changeVisibility,
  createExam,
  deleteExam,
  getExamDownloadUrl,
};

export default examsService;
