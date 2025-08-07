import { useRef, useState } from "react";
import { useAppDispatch } from "@/app/redux/hooks/hooks";
import { uploadFile } from "@/app/redux/slices/tasksSlice";

export const useUploadHook = ({ element, unregister }: any) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useAppDispatch();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: any, onChange: any) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setFileName(file.name);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const base64Data = await fileToBase64(file);

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        // Build the payload as JSON with additional metadata
        const payload = {
          attachmentName: file.name,
          attachmentValue: base64Data,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          fieldName: element.name, // Track which field this upload belongs to
        };

        const result = await dispatch(uploadFile(payload));
        
        // Complete the progress
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Clear the temporary state after successful upload
        setTimeout(() => {
          setFileName("");
          setUploadProgress(0);
          setIsUploading(false);
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        }, 1000);

      } catch (error) {
        console.error("Upload failed", error);
        setFileName("");
        setUploadProgress(0);
        setIsUploading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    }
  };

  const handleCancelUpload = () => {
    setFileName("");
    setUploadProgress(0);
    setIsUploading(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    unregister(element.name);
  };

  return {
    inputRef,
    fileName,
    uploadProgress,
    isUploading,
    handleFileChange,
    handleCancelUpload,
  };
};

export default useUploadHook;