import React, { useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  label: string;
  accept?: string;
  required?: boolean;
  maxSize?: number;
  value: File | null;
  previewUrl?: string;
  onChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = "image/*",
  required = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  value,
  previewUrl,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        alert(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      onChange(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        {value ? (
          <div className="flex items-center gap-2 p-2 border rounded-lg">
            <Image
              src={previewUrl || "/default-image.png"}
              alt="Preview"
              width={48}
              height={48}
              className="object-cover rounded"
            />

            <span className="flex-1 truncate">{value.name}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed
                     border-gray-300 rounded-lg text-gray-600 hover:border-blue-500
                     hover:text-blue-500 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>Choose File</span>
          </button>
        )}
      </div>
    </div>
  );
};
