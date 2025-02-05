"use client";
import { getFiles } from "@/lib/actions/file.actions";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Models } from "node-appwrite";
import React, { useEffect, useState } from "react";
import { fileURLToPath } from "url";
import FormattedDateTime from "./FormattedDateTime";
import Thumbnail from "./Thumbnail";
import { Input } from "./ui/input";

const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await getFiles({ searchText: query });
      setResults(files.documents);
      setOpen(true);
    };
    fetchFiles();
  }, [query]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li className="flex items-center gap-4" key={file.$id}>
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-results">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
