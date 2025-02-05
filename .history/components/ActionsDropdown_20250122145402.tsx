"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(file.name);

  const path = usePathname();

  const closeAllModals = () => {
    setIsDialogOpen(false);
    setIsDropDownOpen(false);
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
      share: () => console.log("share"),
      delete: () => console.log("delete"),
    };

    success = await actions[action.value as keyof typeof actions]();
    if (success) closeAllModals();
    setIsLoading(false);
  };

  const renderDialogContent = () => {
    if (!action) return null;
    const { value, label } = action;

    return (
      <DialogContent
        onClick={(e) => e.stopPropagation()} // Prevent click propagation from dialog content
      >
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            {value === "rename" && "Enter the new name to rename the file:"}
          </DialogDescription>
        </DialogHeader>
        {value === "rename" && (
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={closeAllModals}>
            Cancel
          </Button>
          <Button onClick={handleAction} disabled={isLoading}>
            {isLoading ? "Processing..." : value}
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()} // Prevent click propagation from the card container
    >
      <DropdownMenu
        open={isDropDownOpen}
        onOpenChange={(isOpen) => setIsDropDownOpen(isOpen)}
        modal={false} // Ensure dropdown does not trap focus
      >
        <DropdownMenuTrigger asChild>
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={24}
            height={24}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
          {/* Prevent click propagation from dropdown */}
          <DropdownMenuLabel>{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              onClick={() => {
                setAction(actionItem);
                if (["rename", "share", "delete"].includes(actionItem.value)) {
                  setIsDialogOpen(true);
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
                    width={20}
                    height={20}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={20}
                    height={20}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeAllModals(); // Ensure proper cleanup on close
          }
          setIsDialogOpen(isOpen);
        }}
      >
        {renderDialogContent()}
      </Dialog>
    </div>
  );
};

export default ActionsDropdown;
