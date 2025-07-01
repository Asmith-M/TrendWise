"use client"
import { useEffect, useState } from "react";

export default function ClientFormattedDate({ dateString }) {
  const [formatted, setFormatted] = useState(null);
  useEffect(() => {
    if (dateString) {
      const date = new Date(dateString);
      setFormatted(date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }));
    }
  }, [dateString]);
  if (!formatted) return <span className="inline-block w-24 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />;
  return formatted;
}
