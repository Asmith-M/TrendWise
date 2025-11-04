"use client"

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const debounceTimeout = useRef();
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      const urlSearch = searchParams.get("search") || "";
      setSearchTerm(urlSearch);
      didInit.current = true;
    }
  }, [searchParams]);

  const updateURL = (value) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.replace(`?${params.toString()}`);
    if (onSearch) onSearch(value);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    // Set new timeout for debounced URL update
    debounceTimeout.current = setTimeout(() => {
      updateURL(value);
    }, 300); // Wait 300ms after user stops typing
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Clear any pending debounced update
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    // Immediately update URL on submit
    updateURL(searchTerm);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSearchSubmit} className="inline">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors" />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          autoComplete="off"
        />
      </div>
    </form>
  );
}