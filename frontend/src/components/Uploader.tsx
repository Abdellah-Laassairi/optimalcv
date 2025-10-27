import React, { useCallback, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

type UploaderProps = {
  onFileSelected: (file: File) => void;
};

export default function Uploader({ onFileSelected }: UploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelected(e.dataTransfer.files[0]);
      }
    },
    [onFileSelected],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div
      className={`acv-uploader ${dragOver ? "acv-uploader-active" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <div className="acv-uploader-content">
        <div className="acv-uploader-icon-wrapper">
          <FiUploadCloud className="acv-uploader-icon" />
        </div>
        <div>
          <p className="acv-uploader-title">
            {dragOver
              ? "Drop your file here"
              : "Drag & drop or click to upload"}
          </p>
          <p className="acv-text-muted text-sm">
            Supports PDF, Markdown, and text files
          </p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.md,text/markdown,application/pdf,text/plain"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files && e.target.files[0];
          if (f) onFileSelected(f);
        }}
        aria-label="Upload file"
      />
    </div>
  );
}
