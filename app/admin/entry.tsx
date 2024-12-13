import { Button, User } from "@nextui-org/react";
import ExamBox from "../exams/box";
import { CheckIcon, TrashIcon } from "@heroicons/react/16/solid";
import { ApiExamPopulated } from "@/models/Exam";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminEntry({ exam }: { exam: ApiExamPopulated }) {
  const [disabled, setDisabled] = useState(false);
  const queryClient = useQueryClient();

  const handleApprove = async () => {
    setDisabled(true);

    const response = await fetch(`/api/exams/${exam.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visible: true }),
    });

    if (response.ok) {
      console.log("Approved");

      await queryClient.invalidateQueries({ queryKey: ["exams"] });
    } else {
      console.log("Failed to approve");
    }

    setDisabled(false);
  };

  const handleDelete = async () => {
    setDisabled(true);

    const response = await fetch(`/api/exams/${exam.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Deleted");

      await queryClient.invalidateQueries({ queryKey: ["exams"] });
    } else {
      console.log("Failed to delete");
    }

    setDisabled(false);
  };

  return (
    <div className="p-2" key={exam.id}>
      <User
        description={
          <p>
            lähetti tentin kurssille{" "}
            <strong className="font-bold">{exam.course.name}</strong>
            {`, ${exam.course.year}`}
          </p>
        }
        name="John Doe"
      />
      <div className="flex flex-col sm:flex-row place-items-center mb-5 my-2">
        <ExamBox key={exam.id} exam={exam} />
        <Button
          isIconOnly
          variant="bordered"
          className="ml-5"
          isDisabled={disabled}
          onClick={handleDelete}
        >
          <TrashIcon width={15} />
        </Button>
        <Button
          isIconOnly
          variant="bordered"
          color="primary"
          className="ml-5"
          isDisabled={disabled}
          onClick={handleApprove}
        >
          <CheckIcon width={15} />
        </Button>
      </div>
    </div>
  );
}
