"use client";

import { ApiExamPopulated } from "@/models/Exam";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import AdminEntry from "./entry";
import { useState } from "react";

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
      <h1 className="text-3xl font-bold">Lähetetyt tentit</h1>
      <div className="mt-4">
        {exams?.map((exam) => (
          <AdminEntry key={exam.id} exam={exam} />
        ))}

        {exams?.length === 0 && (
          <div className="text-gray-500">Ei käsittelemättömiä tenttejä.</div>
        )}
      </div>
    </div>
  );
}

export default function ExamsListWrapper({
  initialExams,
}: {
  initialExams: ApiExamPopulated[];
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ExamsList initialExams={initialExams} />
    </QueryClientProvider>
  );
}
