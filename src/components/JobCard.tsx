import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, User, AlertCircle } from 'lucide-react';
import { ConfirmationDialog } from './ConfirmationDialog';

interface Job {
  id: number;
  patientName: string;
  age: number;
  description: string;
  requirements: string[];
  location: string;
  timing: string;
  status: string;
}

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState<'accept' | 'decline' | null>(null);

  const handleAction = (type: 'accept' | 'decline') => {
    setAction(type);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    // Handle the confirmation action here
    console.log(`Job ${action}ed:`, job.id);
    setShowConfirmation(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.patientName}</h3>
            <p className="text-sm text-gray-500">Age: {job.age}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            job.status === 'available' ? 'bg-green-100 text-green-800' :
            job.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{job.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-gray-400" />
            {job.location}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2 text-gray-400" />
            {job.timing}
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
          <ul className="space-y-1">
            {job.requirements.map((req, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleAction('accept')}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 
                     transition-colors duration-200"
          >
            Accept
          </button>
          <button
            onClick={() => handleAction('decline')}
            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg 
                     hover:bg-gray-50 transition-colors duration-200"
          >
            Decline
          </button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        title={`${action === 'accept' ? 'Accept' : 'Decline'} Assignment`}
        message={`Are you sure you want to ${action} this assignment?`}
        confirmText={action === 'accept' ? 'Accept' : 'Decline'}
        confirmColor={action === 'accept' ? 'blue' : 'gray'}
      />
    </motion.div>
  );
};