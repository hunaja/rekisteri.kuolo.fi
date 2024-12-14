import { ApiExam } from "@/models/Exam";
import { DocumentTextIcon } from "@heroicons/react/16/solid";
import { Card, CardBody } from "@nextui-org/card";
import { Chip, Link } from "@nextui-org/react";
import { useState } from "react";

export type ApiExamWithoutCourseAndSubmitter = Omit<
  ApiExam,
  "course" | "submitter"
>;

export default function ExamBox({
  exam,
}: {
  exam: ApiExamWithoutCourseAndSubmitter;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleExamClick = async () => {
    setDownloading(true);

    const response = await fetch(`/api/exams/${exam.id}/download`);
    if (response.ok) {
      const jsonResponse = await response.json();
      window.open(jsonResponse.url, "_blank");
    } else {
      console.log("No file");
    }

    setDownloading(false);
  };

  return (
    <Link
      key={exam.id}
      className="w-full hover:cursor-pointer disabled:hover:cursor-default"
      isDisabled={downloading}
      onClick={handleExamClick}
    >
      <Card className="w-full">
        <CardBody className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <DocumentTextIcon width={25} className="" />
            {exam.year ? (
              <>
                <p className="p-2 flex">Vuosi {exam.year}</p>
                <Chip className="text-sm">{exam.description}</Chip>
              </>
            ) : (
              <p className="p-2 flex">{exam.description}</p>
            )}
          </div>
          <div className="flex flex-row items-center text-sm">
            {exam.fileSize > 0 && (
              <p className="p-2">
                {Math.round(exam.fileSize / 1000 / 1000)} MB,{" "}
                {exam.fileMimeType}
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
