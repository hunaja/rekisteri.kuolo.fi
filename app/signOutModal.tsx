"use client";

import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import StyledSignOutButton from "./signOutButton";

export default function SignOutModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        type="submit"
        color="danger"
        variant="bordered"
        className="self-center mt-5"
        size="lg"
        startContent={<ArrowRightStartOnRectangleIcon width={15} />}
        onClick={onOpen}
      >
        Kirjaudu ulos
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Kirjaudu ulos
              </ModalHeader>
              <ModalBody>
                <p>
                  Oletko varma, että haluat kirjautua ulos? Voit kirjautua
                  takaisin sisään milloin tahansa.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={close}>
                  Sulje
                </Button>
                <StyledSignOutButton />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
