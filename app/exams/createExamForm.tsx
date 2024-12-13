import { ApiCoursePopulated, CourseYear } from "@/models/Course";
import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState } from "react";
import type { ExamForm } from "@/services/exams";

export default function CreateExamForm({
  courses,
  close,
  courseYear,
}: {
  courses: ApiCoursePopulated[];
  courseYear: CourseYear;
  close: () => void;
}) {
  const [selectedCourse, setSelectedCourse] = useState<Set<string | null>>(
    new Set([courses[0]?.id ?? null])
  );
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) {
      return;
    }

    setFile(event.target.files[0]);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    const selectedCourseId = Array.from(selectedCourse)[0];
    event.preventDefault();
    if (!file || !selectedCourseId) return null;

    const examForm: ExamForm = {
      courseId: selectedCourseId,
      description,
      year: Number(year) || null,
      file: {
        name: file.name,
        size: file.size,
      },
    };

    const response = await fetch("/api/exams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(examForm),
    });
    const jsonResponse = await response.json();

    const fileResponse = await fetch(jsonResponse.uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(fileResponse);

    close();
  };

  return (
    <form onSubmit={handleSave}>
      <ModalBody>
        <Input
          label="Vuosikurssi"
          isRequired={true}
          value={`${courseYear.substring(2)}. vsk`}
          isDisabled={true}
        />
        <Select
          label="Kurssi"
          className="mt-2"
          isRequired={true} // @ts-expect-error to be fixed
          selectedKeys={selectedCourse} // @ts-expect-error to be fixed
          onSelectionChange={setSelectedCourse}
          description="Ota yhteyttä itvastaava@kuolo.fi, jos et löydä kurssia valikosta."
        >
          {courses.map((course) => (
            <SelectItem key={course.id} textValue={course.name}>
              {course.name}
            </SelectItem>
          ))}
        </Select>
        <Input
          label="Kuvaus"
          placeholder="Esim. lopputentti tai preppi"
          isRequired={true}
          className="mt-2"
          value={description}
          onValueChange={setDescription}
        />
        <Input
          label="Vuosi"
          placeholder="Jätä tyhjäksi jos yleinen materiaali, esim. tenttipreppi"
          type="number"
          className="mt-2"
          value={year}
          onValueChange={setYear}
        />

        <Button
          as="label"
          htmlFor="file"
          variant="bordered"
          className="mt-2 text-sm"
        >
          <div className="w-full flex flex-row justify-between">
            <div className="mr-2 text-gray-500">Valitse tenttimateriaali</div>
            <div>{file?.name ?? "Ei valittu"}</div>
          </div>
        </Button>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={close}>
          Sulje
        </Button>
        <Button color="primary" type="submit">
          Tallenna
        </Button>
      </ModalFooter>
    </form>
  );
}
