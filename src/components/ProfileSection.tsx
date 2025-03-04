import { DivideIcon as LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface ProfileItem {
  label?: string;
  value: string;
  subtitle?: string;
}

interface ProfileSectionProps {
  icon: typeof LucideIcon;
  title: string;
  items: ProfileItem[];
}

export const ProfileSection = ({
  icon: Icon,
  title,
  items,
}: ProfileSectionProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <div key={index} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                {item.label && (
                  <span className="text-sm text-gray-500">{item.label}</span>
                )}
                <p className="font-medium text-gray-900">{item.value}</p>
                {item.subtitle && (
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
