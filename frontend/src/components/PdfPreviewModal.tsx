import { memo } from "react";
import { FiX, FiDownload } from "react-icons/fi";
import Button from "./Button";

interface PdfPreviewModalProps {
  isOpen: boolean;
  pdfUrl: string | null;
  onClose: () => void;
  onDownload: () => void;
}

const PdfPreviewModal = memo(
  ({ isOpen, pdfUrl, onClose, onDownload }: PdfPreviewModalProps) => {
    if (!isOpen || !pdfUrl) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-7xl h-[90vh] flex flex-col bg-gray-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-900/95 backdrop-blur-sm">
            <div>
              <h2 className="text-2xl font-bold text-white">PDF Preview</h2>
              <p className="text-sm text-gray-400">Your generated CV</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={onDownload}
                iconLeft={<FiDownload />}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                Download PDF
              </Button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10"
                aria-label="Close"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* PDF Iframe */}
          <div className="flex-1 p-4 bg-gray-950/50">
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-xl border border-white/10 bg-white"
              title="PDF Preview"
            />
          </div>
        </div>
      </div>
    );
  },
);

PdfPreviewModal.displayName = "PdfPreviewModal";

export default PdfPreviewModal;
