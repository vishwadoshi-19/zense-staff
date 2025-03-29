import { DivideIcon as LucideIcon } from "lucide-react";

type VitalsCardProps = {
  icon: typeof LucideIcon;
  title: string;
  value: string;
  unit: string;
  onChange?: (newValue: string) => void; // Add onChange prop
};

export const VitalsCard = ({
  icon: Icon,
  title,
  value,
  unit,
}: VitalsCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-teal-50 rounded-lg">
          <Icon className="w-5 h-5 text-teal-700" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      </div>
      <div className="flex items-baseline">
        <input
          type=""
          value={value}
          placeholder="Enter value"
          onChange={(e) => e.target.value}
          className="border border-gray-300 rounded px-2 py-1 text-gray-900 text-sm"
        />
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="ml-1 text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  );
};
