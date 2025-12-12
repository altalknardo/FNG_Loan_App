import React, { useState } from "react";
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  File,
  ExternalLink,
} from "lucide-react";

const baseLink = import.meta.env.VITE_CLOUDFRONT_URL || "";

// File Viewer Component
const FileViewer = ({
  fileUrl,
  isOpen,
  onClose,
}: {
  fileUrl: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Detect file type from URL
  const getFileType = (url: string): "image" | "pdf" | "unknown" => {
    const lowercaseUrl = url.toLowerCase();
    if (lowercaseUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/)) {
      return "image";
    } else if (lowercaseUrl.match(/\.pdf$/)) {
      return "pdf";
    }
    return "unknown";
  };

  const fileType = getFileType(fileUrl);
  console.log(fileUrl, fileType);
  const fileName = fileUrl.split("/").pop() || "file";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] sm:max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {fileType === "pdf" && (
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
            )}
            {fileType === "image" && (
              <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            )}
            {fileType === "unknown" && (
              <File className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
            )}
            {/* <h2 className="text-sm sm:text-base font-semibold truncate">
              {"Submitted"}
            </h2> */}
          </div>

          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = baseLink + fileUrl;
                link.download = fileName;
                link.click();
              }}
              className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100 min-h-0">
          {fileType === "pdf" ? (
            <div className="w-full h-full min-h-[400px] sm:min-h-[600px]">
              <iframe
                src={baseLink + fileUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
          ) : fileType === "image" ? (
            <div className="flex items-center justify-center h-full p-2 sm:p-4 min-h-[400px]">
              <img
                src={baseLink + fileUrl}
                alt={fileName}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 min-h-[400px]">
              <File className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium mb-2">
                Preview not available
              </p>
              <p className="text-xs sm:text-sm mb-3 sm:mb-4">
                This file type cannot be previewed
              </p>
              <button
                onClick={() => window.open(baseLink + fileUrl, "_blank")}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open in new tab
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook to use the file viewer
export const useFileViewer = () => {
  const [viewerState, setViewerState] = useState<{
    isOpen: boolean;
    fileUrl: string;
  }>({
    isOpen: false,
    fileUrl: "",
  });

  const openViewer = (fileUrl: string) => {
    setViewerState({
      isOpen: true,
      fileUrl,
    });
  };

  const closeViewer = () => {
    setViewerState({
      isOpen: false,
      fileUrl: "",
    });
  };

  return {
    openViewer,
    closeViewer,
    viewerState,
    FileViewerComponent: () => (
      <FileViewer
        fileUrl={viewerState.fileUrl}
        isOpen={viewerState.isOpen}
        onClose={closeViewer}
      />
    ),
  };
};
