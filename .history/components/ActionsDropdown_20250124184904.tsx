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

type ActionType = {
  value: string;
  label: string;
  icon: string;
};

const ActionDropdown = ({
  file,
}: {
  file: { name: string; bucketFileId: string };
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // For dialog visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For dropdown visibility
  const [action, setAction] = useState<ActionType | null>(null); // Current selected action
  const [name, setName] = useState(file.name); // Rename file input value
  const [isLoading, setIsLoading] = useState(false); // Loading state for async actions

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);

    // Mock async operation for action
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(false); // Close the modal after the action completes
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
            <Dialog.Header>
              <Dialog.Title>{action?.label || "Action"}</Dialog.Title>
              <Dialog.Close asChild>
                <button aria-label="Close" className="dialog-close-button">
                  X
                </button>
              </Dialog.Close>
            </Dialog.Header>
            <Dialog.Body>
              {action?.value === "rename" && (
                <>
                  <Dialog.Description>
                    Enter a new name for the file:
                  </Dialog.Description>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </>
              )}
              {action?.value === "delete" && (
                <p>
                  Are you sure you want to delete <strong>{file.name}</strong>?
                </p>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button>Cancel</Button>
              </Dialog.Close>
              <Button onClick={handleAction} disabled={isLoading}>
                {isLoading ? "Loading..." : action?.label}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ActionDropdown;
