import { Link } from "lucide-react";
import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";

const Card = ({ file }: { file: Models.Document }) => {
  return (
    <Link href={file.url} target="_blank" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />
      </div>
    </Link>
  );
};

export default Card;
