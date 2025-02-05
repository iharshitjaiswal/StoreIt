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
      <RadixDialog.Content className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
          <h2 className="text-xl font-bold">{label}</h2>
          {value === "rename" && (
            <>
              <p className="text-gray-600 mt-2">Enter new name below:</p>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-3"
              />
            </>
          )}
          {value === "delete" && (
            <p className="text-red-600 mt-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{file.name}</span>?
            </p>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <RadixDialog.Close asChild>
              <Button className="bg-gray-300 text-gray-800 hover:bg-gray-400">
                Cancel
              </Button>
            </RadixDialog.Close>
            <Button
              onClick={handleAction}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {value}
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin ml-2"
                />
              )}
            </Button>
          </div>
        </div>
      </RadixDialog.Content>
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
                onClick={() => {
                  setAction(actionItem);

                  if (
                    ["rename", "share", "delete", "details"].includes(
                      actionItem.value
                    )
                  ) {
                    setIsModalOpen(true);
                  }
                }}
              >
                {actionItem.value === "download" ? (
                  <Link
                    href={constructDownloadUrl(file.bucketFileId)}
                    download={file.name}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={24}
                      height={24}
                    />
                    {actionItem.label}
                  </Link>
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
