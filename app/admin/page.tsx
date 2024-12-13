import { RedirectToSignIn } from "@clerk/nextjs";
import fetchSession from "../fetchSession";
import NavigationBar from "../navigation";
import InauthorizedPage from "../inauthorized";
import ExamsListWrapper from "./list";
import examsService from "@/services/exams";

export default async function Page() {
  const session = await fetchSession();

  if (session.type === "inauthenticated") return <RedirectToSignIn />;
  if (session.type === "inauthorized" || session.type === "advertiser")
    return <InauthorizedPage />;

  const initialExams = await examsService.getAllInvisible();
  if (!initialExams) return <div>Failed to fetch exams</div>;

  console.log("All invisible", initialExams);

  return (
    <>
      <NavigationBar selected="admin" userName={session.name} />
      <ExamsListWrapper initialExams={initialExams} />
    </>
  );
}
