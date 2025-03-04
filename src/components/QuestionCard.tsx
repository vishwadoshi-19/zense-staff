import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  children: React.ReactNode;
  currentIndex: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  children,
  currentIndex,
  totalQuestions,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto w-full"
    >
      <div className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white">{question}</h2>
          <div className="relative">
            {children}
          </div>
        </div>
        <div className="flex items-center justify-between text-gray-400">
          <p>Press Enter ↵</p>
          <div className="flex items-center gap-2">
            <span>{currentIndex + 1}/{totalQuestions}</span>
            <ChevronDown className="animate-bounce" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};