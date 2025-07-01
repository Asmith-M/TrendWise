"use client";
import ClientFormattedDate from "@/components/ClientFormattedDate";
import { Calendar } from "lucide-react";

export default function DetailDateRow({ dateString, readTime }) {
  return (
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
      <span className="flex items-center">
        <Calendar className="w-4 h-4 mr-1" />
        <ClientFormattedDate dateString={dateString} />
      </span>
      {readTime && (
        <span className="flex items-center">
          {readTime}
        </span>
      )}
    </div>
  );
}
