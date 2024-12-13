"use client";

import { ApiExamPopulated } from "@/models/Exam";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import AdminEntry from "./entry";

const queryClient = new QueryClient();

export function ExamsList({
  initialExams,
}: {
  initialExams: ApiExamPopulated[];
}) {
  const { data: exams } = useQuery<ApiExamPopulated[]>({
    queryKey: ["exams"],
    queryFn: () => fetch("/api/exams?invisible=true").then((res) => res.json()),
    initialData: initialExams,
  });

  return (
    <div className="p-4 sm:p-10">
      <h1 className="text-3xl font-bold">Exams</h1>
      <div className="mt-4">
        {exams?.map((exam) => (
          <AdminEntry key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
}

export default function ExamsListWrapper({
  initialExams,
}: {
  initialExams: ApiExamPopulated[];
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ExamsList initialExams={initialExams} />
    </QueryClientProvider>
  );
}
