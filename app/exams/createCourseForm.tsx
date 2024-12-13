"use client";

import { CourseYear } from "@/models/Course";
import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState } from "react";
import { courseYears } from "../constants";
import { useQueryClient } from "@tanstack/react-query";

interface APIError {
  error: string;
  path: string;
}

export default function CreateCourseForm({
  initialCourseYear,
  close,
}: {
  initialCourseYear: CourseYear;
  close: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [selectedYear, setSelectedYear] = useState(
    new Set([initialCourseYear])
  );
  const [error, setError] = useState<APIError | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = {
      name,
      code,
      year: Array.from(selectedYear)[0],
    };

    const returnedForm = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (returnedForm.ok) {
      await queryClient.invalidateQueries({
        queryKey: ["courses", form.year],
      });

      close();
      return;
    }

    const json = await returnedForm.json();
    setError(json);
  };

  return (
    <form onSubmit={onSubmit}>
      <ModalBody>
        <Select
          label="Vuosikurssi"
          className="mt-2"
          isRequired={true}
          isInvalid={error?.path === "year"}
          errorMessage={error?.path === "name" && error.error}
          selectedKeys={selectedYear} // @ts-expect-error to be fixed
          onSelectionChange={setSelectedYear}
        >
          {courseYears.map((year) => (
            <SelectItem key={year} textValue={`${year.substring(2)}. vsk`}>
              {year.substring(2)}. vsk
            </SelectItem>
          ))}
        </Select>
        <Input
          label="Nimi"
          isRequired={true}
          isInvalid={error?.path === "name"}
          errorMessage={error?.path === "name" && error.error}
          placeholder="Esim. Hermosto"
          value={name}
          onValueChange={setName}
        />
        <Input
          label="Koodi"
          className="mt-2"
          placeholder="Esim. HERMO"
          isInvalid={error?.path === "code"}
          errorMessage={error?.path === "name" && error.error}
          value={code}
          onValueChange={setCode}
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
