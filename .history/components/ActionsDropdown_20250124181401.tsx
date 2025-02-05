"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { renameFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { DialogFooter } from "./ui/dialog";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
    };

    success = await actions[action.value as keyof typeof actions]();

    if (success) closeAllModals();

    setIsLoading(false);
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <RadixDialog.DialogContent>
  <RadixDialog.DialogTitle>Rename File</DialogTitle>
  <RadixDialog.DialogDescription>Enter a new name for your file:</RadixDialog.DialogDescription>
  <Input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <DialogFooter>
    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
    <Button onClick={handleRename}>Save</Button>
  </DialogFooter>
</RadixDialog.DialogContent>

    );
  };

  return (
    <div>
      <RadixDialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <RadixDropdownMenu.Root
          open={isDropdownOpen}
          onOpenChange={setIsDropdownOpen}
        >
          <RadixDropdownMenu.Trigger className="cursor-pointer">
            <Image
              src="/assets/icons/dots.svg"
              alt="dots"
              width={34}
              height={34}
            />
          </RadixDropdownMenu.Trigger>
          <RadixDropdownMenu.Content className="bg-white p-3 rounded shadow-lg w-[200px]">
            <div className="mb-2 text-gray-600 truncate">{file.name}</div>
            <hr className="border-gray-300 my-2" />
            {actionsDropdownItems.map((actionItem) => (
              <RadixDropdownMenu.Item
                key={actionItem.value}
                className="cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-gray-100"
                onSelect={(e) => {
                  if (actionItem.value !== "download") {
                    setAction(actionItem);
                    if (
                      ["rename", "share", "delete", "details"].includes(
                        actionItem.value
                      )
                    ) {
                      setIsModalOpen(true);
                    }
                  }
                }}
              >
                {actionItem.value === "download" ? (
                  <a
                    href={constructDownloadUrl(file.bucketFileId)}
                    download={file.name}
                    className="flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={24}
                      height={24}
                    />
                    {actionItem.label}
                  </a>
                ) : (
                  <>
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={24}
                      height={24}
                    />
                    {actionItem.label}
                  </>
                )}
              </RadixDropdownMenu.Item>
            ))}
          </RadixDropdownMenu.Content>
        </RadixDropdownMenu.Root>

        {renderDialogContent()}
      </RadixDialog.Root>
    </div>
  );
};

export default ActionDropdown;
