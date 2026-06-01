import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

const UploadIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#555" }}
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const MAX_IMAGES = 7;

function ImageUploader({ images, onAdd, onRemove, error, onPreview }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((f) => {
        if (f._previewUrl) URL.revokeObjectURL(f._previewUrl);
      });
    };
  }, []);

  const getPreview = (file) => {
    if (!file._previewUrl) file._previewUrl = URL.createObjectURL(file);
    return file._previewUrl;
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      onAdd(e.target.files);
      e.target.value = "";
    }
  };

  // ── Drag handlers ──
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragOver  = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop      = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) onAdd(files);
  };

  // ── Drag zone styles ──
  const emptyZoneClasses = `
    flex flex-col items-center justify-center gap-2 rounded cursor-pointer transition-all duration-150
    ${isDragging 
      ? "border-[1.5px] border-solid border-[#c4956a] bg-[#1a1108] shadow-[inset_0_0_0_2px_rgba(196,149,106,0.15)]" 
      : "border-[1.5px] border-dashed border-[#333] bg-[#141414] hover:border-[#c4956a] hover:bg-[#1a1108]"
    }
  `;

  const filledZoneClasses = `
    rounded transition-all duration-150
    ${isDragging 
      ? "border-[1.5px] border-solid border-[#c4956a] bg-[#1a1108] shadow-[inset_0_0_0_2px_rgba(196,149,106,0.15)]" 
      : "border-[1.5px] border-dashed border-[#333] bg-transparent"
    }
  `;

  return (
    <div>
      {/* Label */}
      <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#c4956a] mb-2">
        Product Images
      </p>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ── Empty state ── */}
      {images.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`${emptyZoneClasses} min-h-[110px] p-5`}
        >
          <UploadIcon />
          <p className="text-xs text-[#888] font-medium text-center">
            Click or drag images here
          </p>
          <p className="text-[10px] text-[#555] text-center font-medium">
            PNG, JPG, WEBP · Max {MAX_IMAGES} images
          </p>
        </div>
      )}

      {/* ── Filled state — wrapping grid with hover preview ── */}
      {images.length > 0 && (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`${filledZoneClasses} p-2`}
        >
          <div className="flex flex-wrap gap-2 py-1.5 px-0.5">
            {images.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="relative flex-shrink-0 w-[52px] h-[52px] group"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  src={getPreview(file)}
                  alt={file.name}
                  className="w-[52px] h-[52px] object-cover rounded-md border border-[#1a1a1a] block cursor-pointer transition-transform duration-200 group-hover:scale-[1.02]"
                  onClick={() => onPreview && onPreview(file)}
                />

                {/* Hover overlay - Click to Preview */}
                <div 
                  className={`
                    absolute inset-0 rounded-md bg-black/60 backdrop-blur-[2px] 
                    flex flex-col items-center justify-center gap-1 cursor-pointer
                    transition-all duration-200
                    ${hoveredIndex === idx ? "opacity-100" : "opacity-0 pointer-events-none"}
                  `}
                  onClick={() => onPreview && onPreview(file)}
                >
                  <EyeIcon />
                  <span className="text-[9px] text-white/90 font-bold tracking-wide uppercase">
                    Preview
                  </span>
                </div>

                {/* Remove button — always visible */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0a0a0a] text-[#f0ede8] text-[10px] font-bold flex items-center justify-center cursor-pointer border border-[#1a1a1a] p-0 z-10 hover:bg-[#f87171] hover:border-[#f87171] transition-colors shadow-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Click to add more — only shown below max */}
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-1 text-[11px] text-[#c4956a] font-bold border-b border-[#c4956a]/40 hover:border-[#c4956a] transition-colors bg-transparent cursor-pointer pb-0.5"
            >
              + Add More
            </button>
          )}

          {/* Image count indicator */}
          <p className="text-[10px] text-[#555] mt-1.5 font-medium">
            {images.length} of {MAX_IMAGES} images
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-1 text-[11px] text-[#f87171] font-medium">{error}</p>
      )}
    </div>
  );
}

export default ImageUploader;