import connectMinio, { bucketPrefix } from "@/connectMinio";
import Course from "@/models/Course";
import Exam, { ExamInterface } from "@/models/Exam";
import mime from "mime-types";

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

const createExam = async (
  examForm: ExamForm
): Promise<ExamInterface & { uploadUrl: string }> => {
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

const getExamDownloadUrl = async (examId: string): Promise<string> => {
  const client = await connectMinio();

  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new Error("Exam not found");
  }

  const bucketName = bucketPrefix + "exams";
  const fileUrl = await client.presignedGetObject(
    bucketName,
    exam.fileName,
    24 * 60 * 60,
    {
      "Content-Disposition": `attachment; filename="lataus.${mime.extension(
        exam.fileMimeType
      )}"`,
    }
  );

  return fileUrl;
};

const examsService = {
  createExam,
  getExamDownloadUrl,
};

export default examsService;
