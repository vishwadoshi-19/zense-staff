'use client';

import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">{testimonial.patientName}</h3>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-600 mb-2">{testimonial.comment}</p>
      <p className="text-sm text-gray-500">{testimonial.date}</p>
    </div>
  );
};