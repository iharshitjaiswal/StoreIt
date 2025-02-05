"use client";
import { convertFileSize } from "@/lib/utils";
import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";
import ActionsDropdown from "./ActionsDropdown";
import FormattedDateTime from "./FormattedDateTime";
import Thumbnail from "./Thumbnail";

const Card = ({ file }: { file: Models.Document }) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if the click is inside the dropdown or dialog
    if (e.target instanceof HTMLElement) {
      const clickedInsideDropdownOrDialog = e.target.closest(
        ".shad-dialog, .shad-dropdown-item"
      );
      if (clickedInsideDropdownOrDialog) {
        e.preventDefault(); // Stop the click from triggering the Link
        e.stopPropagation(); // Stop it from bubbling further
      }
    }
  };

  return (
    <Link
      href={file.url}
      target="_blank"
      className="file-card"
      onClick={handleCardClick}
    >
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />
        <div className="flex flex-col items-end justify-between">
          <ActionsDropdown file={file} />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1"> {file.name}</p>
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">
          By: {file.owner.fullName}
        </p>
      </div>
    </Link>
  );
};

export default Card;
