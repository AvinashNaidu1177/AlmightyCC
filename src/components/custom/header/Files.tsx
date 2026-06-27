import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Eye } from "lucide-react";
import {
 File,
 FileText,
 FileArchive,
 FileVideo,
 FileImage,
 FileSpreadsheet,
 FileCode,
 Download,
 Trash2
} from "lucide-react";
import { API_BASE } from "../Main";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";

export default function Files() {
 const IDs = localStorage.getItem("IDs") || "";
 const userID = IDs ? JSON.parse(IDs).VtopUsername : null;
 const [open, setOpen] = useState(false);
 const [files, setFiles] = useState<any[]>([]);
 const [loadingFiles, setLoadingFiles] = useState(false);
 const [isDeleting, setIsDeleting] = useState(false);

 const formatSize = (bytes: number) => {
 if (bytes < 1024) return `${bytes} B`;
 if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
 return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
 };

 const calcUsed = (files: any[]) =>
 files.reduce((acc, f) => acc + (f.size || 0), 0);


 const fetchFiles = async () => {};
 const deleteFile = async (fileID: string) => {};
 const getDownloadUrl = (fileID: string) => "#";

 useEffect(() => {
 fetchFiles();
 }, []);

 const handleDrop = async (incomingFiles: File[]) => {};

 const handleDownload = async (file) => {
 try {
 const res = await fetch(`${API_BASE}/api/files/download/${userID}/${encodeURIComponent(file.fileID)}`);
 if (!res.ok) throw new Error("Failed to download file");

 const blob = await res.blob();
 const url = window.URL.createObjectURL(blob);

 const a = document.createElement("a");
 a.href = url;
 a.download = file.name;
 document.body.appendChild(a);
 a.click();

 window.URL.revokeObjectURL(url);
 } catch (err) {
 console.error(err);
 }
 };

  return (
  <div>
    <button
      onClick={() => setOpen(!open)}
      className="w-full flex items-center justify-between font-semibold 
      text-xl text-gray-300 dark:text-gray-200"
    >
      <span>Uploaded Files</span>
      <div className="flex items-center gap-3">
        {open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </div>
    </button>
    <div className={`transition-all duration-300 ${open ? "max-h-[500px] overflow-y-auto" : "max-h-0 overflow-hidden"}`}>
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-400 font-medium text-sm mb-2">Files are temporarily disabled.</p>
        <p className="text-gray-500 text-xs">This feature is not yet supported by the current backend. (Coming Soon)</p>
      </div>
    </div>
  </div>
  );
}

const getFileIcon = (ext: string) => {
 if (!ext) return <File className="w-5 h-5 text-gray-500" />;
 const e = ext.toLocaleLowerCase();
 if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(e)) return <FileImage className="w-5 h-5 text-purple-600" />;
 if (["pdf"].includes(e)) return <FileText className="w-5 h-5 text-red-600" />;
 if (["zip", "rar", "7z"].includes(e)) return <FileArchive className="w-5 h-5 text-yellow-600" />;
 if (["mp4", "mov", "avi"].includes(e)) return <FileVideo className="w-5 h-5 text-purple-600" />;
 if (["xlsx", "xls", "csv"].includes(e)) return <FileSpreadsheet className="w-5 h-5 text-purple-600" />;
 if (["js", "ts", "json", "html", "css", "py"].includes(e)) return <FileCode className="w-5 h-5 text-indigo-600" />;
 return <File className="w-5 h-5" />;
}