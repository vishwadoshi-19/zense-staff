"use client";

import { DivideIcon as LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: typeof LucideIcon;
  title: string;
  value: number;
  suffix?: string;
}

export const StatsCard = ({
  icon: Icon,
  title,
  value,
  suffix = "",
}: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-teal-700" />
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value}
        {suffix && <span className="text-gray-500 text-lg">{suffix}</span>}
      </p>
    </div>
  );
};
