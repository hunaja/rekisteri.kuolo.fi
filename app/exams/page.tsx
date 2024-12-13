import { RedirectToSignIn } from "@clerk/nextjs";
import fetchSession from "../fetchSession";
import InauthorizedPage from "../inauthorized";
import NavigationBar from "../navigation";
import Head from "next/head";
import ExamsListWrapper from "./list";
import coursesService from "@/services/courses";

export default async function ExamsPage() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") {
    return <RedirectToSignIn />;
  } else if (session.type === "inauthorized") {
    return <InauthorizedPage />;
  }

  const userCourseYear =
    session.type === "user" &&
    session.course !== "alumni" &&
    session.course !== "LTn"
      ? session.course
      : "LT1";

  const initialCourses = await coursesService.getCoursesForYear(userCourseYear);
  if (!initialCourses) return <p>Server Error</p>;

  return (
    <>
      <Head>
        <title>Tentit | KuoLO Ry</title>
      </Head>
      <NavigationBar selected="exams" userName={session.name} />
      <ExamsListWrapper
        initialCourseYear={
          session.type === "user" &&
          session.course !== "alumni" &&
          session.course !== "LTn"
            ? session.course
            : "LT1"
        }
        initialCourses={initialCourses}
      />
    </>
  );
}
