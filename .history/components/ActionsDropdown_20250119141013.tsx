"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { renameFile } from "@/lib/actions/file.actions";

const ActionsDropdown = ({ file }: { file: Models.Document }) => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(file.name);

  const dropdownTriggerRef = useRef<HTMLButtonElement>(null); // To restore focus
  const path = usePathname();

  const closeAllModals = () => {
    setIsModelOpen(false);
    setIsDropDownOpen(false);
    setAction(null);
    setName(file.name);

    // Restore focus to the dropdown trigger after closing dialog
    if (dropdownTriggerRef.current) {
      dropdownTriggerRef.current.focus();
    }

    // Ensure no lingering focus issues
    const activeElement = document.activeElement as HTMLElement | null;
    activeElement?.blur();
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => console.log("share"),
      delete: () => console.log("delete"),
    };

    const success = await actions[action.value as keyof typeof actions]();
    if (success) closeAllModals();
    setIsLoading(false);
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              closeAllModals();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAction} disabled={isLoading}>
            {value}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="animate-spin"
              />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  };

  return (
    <Dialog
      open={isModelOpen}
      onOpenChange={(open) => {
        setIsModelOpen(open);
        if (!open) closeAllModals();
      }}
    >
      <DropdownMenu
        open={isDropDownOpen}
        onOpenChange={(open) => setIsDropDownOpen(open)}
      >
        <DropdownMenuTrigger ref={dropdownTriggerRef}>
          <Image
            src="/assets/icons/dots.svg"
            alt="dot"
            width={24}
            height={24}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              onClick={() => {
                setAction(actionItem);
                if (["rename", "share", "delete"].includes(actionItem.value)) {
                  setIsModelOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
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
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={24}
                    height={24}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionsDropdown;
