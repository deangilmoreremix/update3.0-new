import React, { useState, useRef, useCallback } from 'react';
import { X, Camera, RefreshCw } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File, previewUrl: string) => void;
  onImageRemove?: () => void;
  type?: 'contact' | 'deal' | 'company';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  placeholder?: string;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  onImageRemove,
  type = 'contact',
  className = '',
  size = 'md',
  placeholder,
  showRefreshButton = false,
  onRefresh,
  isRefreshing = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-16 h-16', icon: 16, text: 'text-xs' },
    md: { container: 'w-24 h-24', icon: 20, text: 'text-sm' },
    lg: { container: 'w-32 h-32', icon: 24, text: 'text-base' },
    xl: { container: 'w-40 h-40', icon: 28, text: 'text-lg' }
  };

  const config = sizeConfig[size];

  // Get appropriate icon and styling based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'contact':
        return {
          icon: User,
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-200',
          hoverColor: 'hover:bg-blue-100'
        };
      case 'deal':
        return {
          icon: Building2,
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200',
          hoverColor: 'hover:bg-green-100'
        };
      case 'company':
        return {
          icon: Building2,
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600',
          borderColor: 'border-purple-200',
          hoverColor: 'hover:bg-purple-100'
        };
      default:
        return {
          icon: ImageIcon,
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600',
          borderColor: 'border-gray-200',
          hoverColor: 'hover:bg-gray-100'
        };
    }
  };

  const typeConfig = getTypeConfig();
  const TypeIcon = typeConfig.icon;

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB.');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      onImageChange(file, previewUrl);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  }, [handleFileSelect]);

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          ${config.container} mx-auto relative rounded-full overflow-hidden
          border-2 ${isDragging ? 'border-blue-400 bg-blue-50' : typeConfig.borderColor}
          ${currentImage ? 'group cursor-pointer' : `${typeConfig.bgColor} ${typeConfig.hoverColor} cursor-pointer`}
          transition-all duration-200 ease-in-out
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        {currentImage ? (
          <>
            <img
              src={currentImage}
              alt={`${type} image`}
              className="w-full h-full object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <Camera 
                size={config.icon} 
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
              />
            </div>
            {/* Remove button */}
            {onImageRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageRemove();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                <X size={12} />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isUploading ? (
              <RefreshCw size={config.icon} className={`${typeConfig.iconColor} animate-spin`} />
            ) : (
              <div className="text-center">
                <TypeIcon size={config.icon} className={typeConfig.iconColor} />
                {size !== 'sm' && (
                  <p className={`${config.text} ${typeConfig.iconColor} mt-1 font-medium`}>
                    {placeholder || `Add ${type} image`}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Refresh button for AI image finding */}
        {showRefreshButton && currentImage && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRefresh?.();
            }}
            disabled={isRefreshing}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        )}
      </div>

      {/* Upload instruction text */}
      {!currentImage && size !== 'sm' && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Click to upload or drag & drop
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;