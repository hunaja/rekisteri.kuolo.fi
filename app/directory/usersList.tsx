"use client";

import type { UserInterface } from "@/models/User";
import { Button } from "@nextui-org/button";
import { type Selection } from "@nextui-org/react";
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
import { ArrowDownIcon } from "@heroicons/react/16/solid";
import UserBox from "./box";

const queryClient = new QueryClient();

type ApiUsers = {
  data: UserInterface[];
  next: string | null;
};

function UsersList() {
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
    ApiUsers,
    unknown,
    InfiniteData<{ data: UserInterface[] }>,
    readonly unknown[],
    string
  >({
    queryKey: ["users", debouncedSettings.courses, debouncedSettings.name],
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
        <div className="pl-5 flex-1">
          <Dropdown>
            <DropdownTrigger>
              <Button
                size="lg"
                color="primary"
                startContent={<FunnelIcon width={15} />}
              >
                Vsk
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

      {!error && !isPending && data?.pages[0]?.data.length !== 0 && (
        <ul className="p-4 sm:p-10">
          {data?.pages.map((p, i) => (
            <React.Fragment key={i}>
              {p.data?.map((u) => (
                <li key={u.email}>
                  <UserBox user={u} />
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      )}

      {!isPending &&
        !isFetchingNextPage &&
        data?.pages.length === 1 &&
        data.pages[0].data.length === 0 && (
          <div className="flex-1 text-center flex flex-col place-content-center">
            <h1 className="text-3xl mb-5">Ei tuloksia</h1>
            <p>Ei hakutuloksia. Muuta hakuehtoja.</p>
          </div>
        )}

      {isPending && <Spinner className="p-10 flex-1" />}

      {hasNextPage && isFetchingNextPage && <Spinner className="mb-10" />}
      {hasNextPage && !isFetchingNextPage && (
        <Button
          color="primary"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="mb-10 self-center"
          startContent={<ArrowDownIcon width={15} />}
          size="lg"
        >
          Lataa lisää
        </Button>
      )}
    </>
  );
}

export default function UsersListWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersList />
    </QueryClientProvider>
  );
}
