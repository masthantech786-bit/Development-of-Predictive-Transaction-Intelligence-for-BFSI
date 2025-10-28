import React, { useState, useCallback } from "react";
import Papa from "papaparse";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

interface UploadSectionProps {
  onFileUpload: (data: any[]) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileName, setFileName] = useState("");
  const [rowCount, setRowCount] = useState(0);

const handleFile = useCallback(
  (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          let data = results.data as any[];

          // ✅ If CSV doesn’t have predictions, create them
          if (!("predicted" in data[0])) {
            data = data.map((row) => {
              const amount = parseFloat(row.transaction_amount || "0");
              const failedLogins = parseInt(row.failed_login_attempts || "0");

              // Simple fraud detection rule
              const prediction =
                amount > 100000 || failedLogins > 3 ? 1 : 0;

              return { ...row, predicted: prediction };
            });
          }

          setRowCount(data.length);
          onFileUpload(data); // send enriched dataset
          setUploadStatus("success");
        } catch {
          setUploadStatus("error");
        }
      },
      error: () => setUploadStatus("error"),
    });
  },
  [onFileUpload]
);


  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const files = e.dataTransfer.files;
      if (files && files[0]) handleFile(files[0]);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) handleFile(files[0]);
    },
    [handleFile]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Dataset Upload</h2>
        <p className="text-sm text-gray-600">Upload your transaction CSV file to begin analysis</p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : uploadStatus === "success"
            ? "border-green-400 bg-green-50"
            : uploadStatus === "error"
            ? "border-red-400 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center" aria-live="polite">
          {uploadStatus === "uploading" && (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          )}
          {uploadStatus === "success" && <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-4" />}
          {uploadStatus === "error" && <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-4" />}
          {uploadStatus === "idle" && <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />}

          <div className="text-gray-600">
            {uploadStatus === "uploading" && <p>Processing your file...</p>}
            {uploadStatus === "success" && (
              <div>
                <p className="text-green-600 font-medium">File uploaded successfully!</p>
                <p className="text-sm text-gray-500">
                  {fileName} ({rowCount} rows)
                </p>
              </div>
            )}
            {uploadStatus === "error" && <p className="text-red-600">Error processing file. Please try again.</p>}
            {uploadStatus === "idle" && (
              <div>
                <p className="text-lg font-medium mb-2">
                  <span className="text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">CSV files only</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {fileName && uploadStatus === "success" && (
        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
          <FileText className="h-4 w-4" />
          <span>
            Loaded: {fileName} ({rowCount} records)
          </span>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
