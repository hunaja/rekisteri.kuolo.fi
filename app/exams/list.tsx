"use client";

import {
  AcademicCapIcon,
  DocumentTextIcon,
  PlusCircleIcon,
} from "@heroicons/react/16/solid";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import {
  Chip,
  Link,
  Modal,
  ModalContent,
  Selection,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { CourseInterface, CourseYear } from "@/models/Course";
import CreateCourseForm from "./createCourseForm";
import { courseYears } from "../constants";
import CreateExamForm from "./createExamForm";
import { ExamInterface } from "@/models/Exam";

const queryClient = new QueryClient();

type Tab = "createCourse" | "createExam";

export function ExamsList({
  initialCourseYear,
  initialCourses,
}: {
  initialCourseYear: CourseYear;
  initialCourses: CourseInterface[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set([initialCourseYear])
  );
  const [selectedTab, setSelectedTab] = useState("createExam");

  const selectedYear = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

  const { data: courses, isPending } = useQuery<CourseInterface[]>({
    queryKey: ["courses", selectedYear],
    queryFn: () =>
      fetch(`/api/courses?year=${selectedYear}`).then((res) => res.json()),
    initialData:
      (selectedYear === initialCourseYear && initialCourses) || undefined,
  });

  const handleExamClick = (exam: ExamInterface) => async () => {
    const response = await fetch(`/api/exams/${exam.id}/download`);
    if (response.ok) {
      const jsonResponse = await response.json();
      window.open(jsonResponse.url, "_blank");
    }
  };

  console.log(courses);

  return (
    <>
      <div className="flex justify-end px-2 sm:px-4 flex-grow-0">
        <Dropdown>
          <DropdownTrigger>
            <Button
              color="primary"
              startContent={<AcademicCapIcon width={15} />}
            >
              {selectedYear.substring(2)}. vsk
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            disabledKeys={isPending ? new Set(courseYears) : undefined}
            aria-label="Valitse vuosikurssi"
            selectionMode="single"
          >
            <DropdownItem key="LT1">1. vsk</DropdownItem>
            <DropdownItem key="LT2">2. vsk</DropdownItem>
            <DropdownItem key="LT3">3. vsk</DropdownItem>
            <DropdownItem key="LT4">4. vsk</DropdownItem>
            <DropdownItem key="LT5">5. vsk</DropdownItem>
            <DropdownItem key="LT6">6. vsk</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button
          color="primary"
          variant="bordered"
          isIconOnly
          className="ml-2"
          onClick={onOpen}
          isDisabled={isPending}
        >
          <PlusCircleIcon width={15} />
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(close) => (
              <>
                <Tabs
                  fullWidth
                  aria-label="Lisää tentti tai kurssi"
                  selectedKey={selectedTab} // @ts-expect-error to be fixed
                  onSelectionChange={setSelectedTab}
                  size="md"
                  className="pt-5 px-10"
                >
                  <Tab key="createExam" title="Lähetä tenttimateriaalia">
                    {courses ? (
                      <CreateExamForm
                        courseYear={selectedYear as CourseYear}
                        courses={courses}
                        close={close}
                      />
                    ) : (
                      <p>Ladataan kursseja...</p>
                    )}
                  </Tab>
                  <Tab key="createCourse" title="Lisää kurssi">
                    <CreateCourseForm
                      close={close}
                      initialCourseYear={selectedYear as CourseYear}
                    />
                  </Tab>
                </Tabs>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      {isPending && <Spinner className="p-10 flex-1" />}

      {!isPending &&
        courses &&
        (courses.length === 0 || !courses.find((c) => c.exams.length > 0)) && (
          <div className="flex-1 text-center flex flex-col place-content-center">
            <h1 className="text-3xl mb-5">Ei tenttejä</h1>
            <p>
              Tälle vuosikurssille ei ole vielä lähetetty tenttejä. Ole
              ensimmäinen!
            </p>
          </div>
        )}

      {courses && courses.length !== 0 && (
        <div className="p-4 sm:p-10">
          <Accordion>
            {courses
              .filter((c) => c.exams.length > 0)
              .map((course) => (
                <AccordionItem
                  key={course.code ?? course.name}
                  title={course.code ?? course.name}
                  subtitle={`${course.name}, ${
                    course.exams.length > 1
                      ? `${course.exams.length} tenttiä`
                      : "1 tentti"
                  }`}
                >
                  {(course.exams as ExamInterface[]).map((exam) => (
                    <Link
                      key={exam.id}
                      className="w-full mb-5 hover:cursor-pointer"
                      onClick={handleExamClick(exam)}
                    >
                      <Card className="w-full">
                        <CardBody className="flex flex-row items-center justify-between">
                          <div className="flex flex-row items-center">
                            <DocumentTextIcon width={25} className="" />
                            {exam.year ? (
                              <>
                                <p className="p-2 flex">Vuosi {exam.year}</p>
                                <Chip className="text-sm">
                                  {exam.description}
                                </Chip>
                              </>
                            ) : (
                              <p className="p-2 flex">{exam.description}</p>
                            )}
                          </div>
                          <div className="flex flex-row items-center text-sm">
                            {exam.fileSize && (
                              <p className="p-2">
                                {Math.round(exam.fileSize / 1000 / 1000)} MB,{" "}
                                {exam.fileMimeType}
                              </p>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  ))}
                </AccordionItem>
              ))}
            {/* <AccordionItem
            key="REPULSE"
            title="REPULSE"
            subtitle={
              <span>
                <strong>Elimistön puolustusjärjestelmät</strong>, 3 koetta
              </span>
            }
          >
            <Link href="/download-exam" className="w-full">
              <Card className="mb-2 w-full">
                <CardBody className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center">
                    <DocumentTextIcon width={25} className="" />
                    <p className="p-2 flex">Vuosi 2020</p>
                    <Chip className="text-sm">lopputentti</Chip>
                  </div>
                </CardBody>
              </Card>
            </Link>
            <Link href="/download-exam" className="w-full">
              <Card className="mb-2 w-full">
                <CardBody className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center">
                    <DocumentTextIcon width={25} className="" />
                    <p className="p-2 flex">Vuosi 2020</p>
                    <Chip className="text-sm">vastaukseton lopputentti</Chip>
                  </div>
                </CardBody>
              </Card>
            </Link>
            <Link href="/download-exam" className="w-full">
              <Card className="mb-2 w-full">
                <CardBody className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center">
                    <DocumentTextIcon width={25} className="" />
                    <p className="p-2 flex">Vuosi 2019</p>
                    <Chip className="text-sm">lopputentti</Chip>
                  </div>
                </CardBody>
              </Card>
            </Link> 
          </AccordionItem>*/}
          </Accordion>
        </div>
      )}
    </>
  );
}

export default function ExamsListWrapper({
  initialCourseYear,
  initialCourses,
}: {
  initialCourseYear: CourseYear;
  initialCourses: CourseInterface[];
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ExamsList
        initialCourseYear={initialCourseYear}
        initialCourses={initialCourses}
      />
    </QueryClientProvider>
  );
}
