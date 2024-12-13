import connectMongo from "@/connectMongo";
import Course, {
  ApiCourse,
  ApiCoursePopulated,
  CourseYear,
} from "@/models/Course";

const getCoursesForYear = async (
  year: CourseYear
): Promise<ApiCoursePopulated[]> => {
  await connectMongo();

  const courses = await Course.find({ year }).populate({
    path: "exams",
    match: { visible: true },
  });
  const jsonCourses = courses.map((c) => {
    const jsonCourse = c.toJSON();

    const exams = c.exams.map((e) => {
      // @ts-expect-error mongoose types suck
      const { __v: ignored, _id: id, ...jsonExam } = e._doc; // eslint-disable-line @typescript-eslint/no-unused-vars

      return {
        ...jsonExam,
        // @ts-expect-error mongoose types suck
        course: jsonCourse.id.toString(),
        id: id.toString(),
      };
    });

    return {
      ...jsonCourse,
      // @ts-expect-error mongoose types suck
      id: jsonCourse.id.toString(),
      exams,
    };
  });

  return jsonCourses;
};

const createCourse = async (
  name: string,
  year: CourseYear,
  code?: string
): Promise<ApiCourse> => {
  await connectMongo();

  const course = new Course({ name, code, year });
  const savedCourse = await course.save();
  // @ts-expect-error mongoose types suck
  return savedCourse.toJSON();
};

const coursesService = {
  getCoursesForYear,
  createCourse,
};

export default coursesService;
