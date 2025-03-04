import { Clock } from "lucide-react";

interface AttendanceProps {
  attendance: {
    clockIn: string;
    clockOut: string;
    totalHours: number;
  };
}

export const AttendanceBar = ({ attendance }: AttendanceProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-900">Shift Hours</span>
        </div>
        <span className="text-sm text-gray-500">
          {attendance.totalHours} hours
        </span>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${(attendance.totalHours / 12) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{attendance.clockIn}</span>
          <span>{attendance.clockOut}</span>
        </div>
      </div>
    </div>
  );
};
