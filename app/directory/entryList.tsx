"use client";

import type { UserInterface } from "@/models/User";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Avatar, type Selection } from "@nextui-org/react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import {
  InfiniteData,
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { FunnelIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/16/solid";

const queryClient = new QueryClient();

type ApiEntries = {
  entries: UserInterface[];
  next: string | null;
};

function EntryList() {
  const [name, setName] = useState("");
  const [courses, setCourses] = useState<Selection>(
    new Set(["LT1", "LT2", "LT3", "LT4", "LT5", "LT6", "LTn"])
  );

  const [debouncedSettings] = useDebounce<{ name: string; courses: string }>(
    {
      name,
      courses: Array.from(courses).join(","),
    },
    1500
  );

  const {
    isPending,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    ApiEntries,
    unknown,
    InfiniteData<{ data: UserInterface[] }>,
    readonly unknown[],
    string
  >({
    queryKey: ["entries", debouncedSettings.courses, debouncedSettings.name],
    queryFn: ({ pageParam }) =>
      fetch(
        `/api/users?` +
          new URLSearchParams({
            courses: debouncedSettings.courses,
            name: debouncedSettings.name,
            next: pageParam,
          })
      ).then((r) => r.json()),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.next,
  });

  return (
    <>
      <fieldset
        className="flex justify-between items-center px-2 sm:px-4 flex-grow-0"
        disabled={isPending}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Hae..."
        />
        <div className="pl-5 flex">
          <Dropdown>
            <DropdownTrigger>
              <Button
                size="lg"
                color="primary"
                startContent={<FunnelIcon width={15} />}
              >
                <p className="hidden sm:block">Vuosikurssit</p>
                <p className="block sm:hidden font-bold">VSK</p>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Multiple selection example"
              variant="flat"
              closeOnSelect={false}
              disallowEmptySelection
              selectionMode="multiple"
              selectedKeys={courses}
              onSelectionChange={setCourses}
            >
              <DropdownItem key="LT1">LT1</DropdownItem>
              <DropdownItem key="LT2">LT2</DropdownItem>
              <DropdownItem key="LT3">LT3</DropdownItem>
              <DropdownItem key="LT4">LT4</DropdownItem>
              <DropdownItem key="LT5">LT5</DropdownItem>
              <DropdownItem key="LT6">LT6</DropdownItem>
              <DropdownItem key="LTn">LTn</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </fieldset>
      {!error && !isPending && (
        <ul className="p-4 sm:p-10">
          {data?.pages.map((p, i) => (
            <React.Fragment key={i}>
              {p.data?.map((e) => (
                <li key={e.email}>
                  <Card className="mb-5 w-full sm:w-96 flex flex-row items-center">
                    <div className="p-5">
                      <Avatar size="lg" />
                    </div>
                    <div>
                      <CardBody className="">
                        <h3 className="text-2xl pt-2">{e.name}</h3>
                        <div>
                          <div className="flex pt-3 flex-row place-items-center content-center">
                            <AcademicCapIcon width={10} />
                            <span className="pl-2">
                              {e.course.substring(2)}. vuosikurssi
                            </span>
                          </div>

                          <div className="flex flex-row py-3 place-items-center content-center">
                            <EnvelopeIcon width={10} />
                            <span className="pl-2">
                              <Link href={`mailto:${e.email}`}>{e.email}</Link>
                            </span>
                          </div>

                          {e.phoneNumber && (
                            <div className="flex flex-row pb-3 place-items-center content-center">
                              <PhoneIcon width={10} />
                              <span className="pl-2">
                                <Link href={`tel:${e.phoneNumber}`}>
                                  {e.phoneNumber}
                                </Link>
                              </span>
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </div>
                  </Card>
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      )}

      {isPending && <Spinner className="p-10" />}

      {hasNextPage && isFetchingNextPage && <Spinner className="mb-10" />}

      {hasNextPage && !isFetchingNextPage && (
        <Button
          color="primary"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="mb-10 self-center"
        >
          Lataa lisää
        </Button>
      )}
    </>
  );
}

export default function EntryListWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <EntryList />
    </QueryClientProvider>
  );
}
