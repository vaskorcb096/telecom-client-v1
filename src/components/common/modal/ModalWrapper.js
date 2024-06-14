"use client"

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";

const ModalWrapper = ({
  size,
  isOpen,
  onClose,
  title,
  content,
  footerContent,
  onActionButton,
  actionButtonText,
  closeButtonText,
  hideCloseButton = false,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [modalSize, setModalSize] = useState("md");

  useEffect(() => {
    setModalSize(isMobile ? "full" : "md");
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop='blur'
      size={size || modalSize}
      scrollBehavior='inside'
      placement='center'
      hideCloseButton={hideCloseButton}
      classNames={{
        header: "px-5 sm:px-6 pt-5 sm:pt-6 pb-4",
        body: "px-5 sm:px-6 pb-6 pt-0",
        closeButton: "hover:bg-gray-100 mt-3 mr-2 text-xl text-neutral",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-base sm:text-lg font-mulish font-bold sm:font-extrabold text-neutral'>
              {title}
            </ModalHeader>
            <ModalBody>{content}</ModalBody>
            {footerContent && (
              <ModalFooter>
                {closeButtonText && (
                  <Button color='danger' variant='light' onClick={onClose}>
                    {closeButtonText}
                  </Button>
                )}
                {actionButtonText && (
                  <Button color='primary' onClick={onActionButton}>
                    {actionButtonText}
                  </Button>
                )}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalWrapper;
