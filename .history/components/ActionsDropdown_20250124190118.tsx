"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import { Models } from "node-appwrite";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Dialog visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  const [action, setAction] = useState<ActionType | null>(null); // Current selected action
  const [name, setName] = useState(file.name); // Rename input value
  const [isLoading, setIsLoading] = useState(false); // Loading state for actions

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name); // Reset name on close
  };

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);

    // Simulate an async action
    setTimeout(() => {
      setIsLoading(false);
      closeAllModals(); // Close the modal after the action completes
    }, 1000);
  };

  return (
    <div>
      {/* Dropdown Menu */}
      <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          <button>
            <Image
              src="/assets/icons/dots.svg"
              alt="dots"
              width={34}
              height={34}
            />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="dropdown-menu-content">
            <DropdownMenu.Label>{file.name}</DropdownMenu.Label>
            <DropdownMenu.Separator />
            {actionsDropdownItems.map((item) => (
              <DropdownMenu.Item
                key={item.value}
                onClick={() => {
                  setAction(item);

                  if (["rename", "delete", "share"].includes(item.value)) {
                    setIsModalOpen(true); // Open the modal for specific actions
                  }
                }}
              >
                {item.value === "download" ? (
                  <Link
                    href={constructDownloadUrl(file.bucketFileId)}
                    download={file.name}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={30}
                      height={30}
                    />
                    {item.label}
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={30}
                      height={30}
                    />
                    {item.label}
                  </div>
                )}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Dialog */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="text-center text-lg font-bold">
              {action?.label || "Action"}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500">
              {action?.value === "rename" && "Enter a new name for the file:"}
              {action?.value === "delete" &&
                `Are you sure you want to delete "${file.name}"?`}
            </Dialog.Description>

            {action?.value === "rename" && (
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-4"
              />
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <Button variant="ghost" className="cancel-button">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleAction} disabled={isLoading}>
                {isLoading ? "Loading..." : action?.label}
              </Button>
            </div>

            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="absolute top-3 right-3 rounded-full focus:outline-none"
              >
                X
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ActionDropdown;
