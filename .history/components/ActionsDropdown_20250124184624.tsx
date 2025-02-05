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

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    // Handle actions like rename/delete
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(false);
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
          <DropdownMenu.Content>
            <DropdownMenu.Label>{file.name}</DropdownMenu.Label>
            <DropdownMenu.Separator />
            {actionsDropdownItems.map((item) => (
              <DropdownMenu.Item
                key={item.value}
                onClick={() => {
                  setAction(item);
                  if (["rename", "delete"].includes(item.value))
                    setIsModalOpen(true);
                }}
              >
                {item.value === "download" ? (
                  <Link
                    href={constructDownloadUrl(file.bucketFileId)}
                    download={file.name}
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
              <Dialog.Title>{action?.label}</Dialog.Title>
              <Dialog.Close asChild>
                <button aria-label="Close">X</button>
              </Dialog.Close>
            </Dialog.Header>
            {action?.value === "rename" && (
              <>
                <Dialog.Description>
                  Enter a new name for the file:
                </Dialog.Description>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </>
            )}
            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button>Cancel</Button>
              </Dialog.Close>
              <Button onClick={handleAction}>
                {isLoading ? "Loading..." : action?.value}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ActionDropdown;
