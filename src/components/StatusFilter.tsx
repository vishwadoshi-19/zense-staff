import { motion } from 'framer-motion';

interface StatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const StatusFilter = ({ selectedStatus, onStatusChange }: StatusFilterProps) => {
  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {statuses.map(status => (
        <button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            selectedStatus === status.value
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
};