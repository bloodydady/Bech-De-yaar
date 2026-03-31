import React, { useCallback, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUpload = ({ images, setImages, maxImages = 2, maxSizeMB = 1 }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${maxSizeMB}MB`);
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      const allowedSlots = maxImages - images.length;
      if (allowedSlots > 0) {
         setImages(prev => [...prev, ...validFiles.slice(0, allowedSlots)]);
      }
    } else {
      setImages(prev => [...prev, ...validFiles]);
    }
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
            isDragging ? 'border-brand-orange bg-orange-50' : 'border-gray-300 hover:border-brand-orange hover:bg-gray-50'
          }`}
        >
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            id="image-upload"
            onChange={(e) => {
                if(e.target.files) handleFiles(e.target.files);
                e.target.value = ''; // reset
            }}
          />
          <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer w-full h-full">
            <div className="w-16 h-16 bg-brand-navy/5 text-brand-navy rounded-full flex items-center justify-center mb-4">
               <UploadCloud className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-gray-700 font-semibold mb-1">Click to upload or drag and drop</p>
            <p className="text-gray-400 text-sm mb-4 text-center px-4">
              SVG, PNG, JPG or WEBP (max. {maxSizeMB}MB)
            </p>
            <div className="px-6 py-2 bg-white border border-gray-200 shadow-sm text-brand-navy rounded-lg font-semibold hover:border-brand-orange transition-colors">
              Browse Files
            </div>
          </label>
        </div>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
           <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-gray-700">Selected Images ({images.length}/{maxImages})</h4>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, index) => {
                const url = typeof img === 'string' ? img : URL.createObjectURL(img);
                return (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                    <img 
                      src={url} 
                      alt={`upload-${index}`} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      onLoad={() => typeof img !== 'string' && URL.revokeObjectURL(url)}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         type="button" 
                         onClick={() => removeImage(index)} 
                         className="bg-white text-red-500 rounded-full p-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-red-500 hover:text-white"
                       >
                         <X className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
