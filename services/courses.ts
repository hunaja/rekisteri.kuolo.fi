import connectMongo from "@/connectMongo";
import Course, { CourseInterface, CourseYear } from "@/models/Course";
import { ExamInterface } from "@/models/Exam";

const getCoursesForYear = async (
  year: CourseYear
): Promise<CourseInterface[]> => {
  await connectMongo();

  const courses = await Course.find({ year }).populate("exams");
  const jsonCourses = courses.map((c) => {
    const jsonCourse = c.toJSON();

    const exams = c.exams.map((e) => {
      const { __v: ignored, _id: id, ...jsonExam } = e.toJSON();

      return {
        ...jsonExam,
        id: id.toString(),
      };
    });

    return {
      ...jsonCourse,
      exams,
    };
  });

  return jsonCourses;
};

const createCourse = async (name: string, year: CourseYear, code?: string) => {
  await connectMongo();

  const course = new Course({ name, code, year });
  const savedCourse = await course.save();
  return savedCourse.toJSON();
};

const coursesService = {
  getCoursesForYear,
  createCourse,
};

export default coursesService;
