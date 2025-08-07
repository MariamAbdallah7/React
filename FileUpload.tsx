"use client";
import { useFormContext, useController } from "react-hook-form";
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Chip,
} from "@mui/material";
import { Paperclip, X } from "lucide-react";
import LabelComp from "./Label";
import FieldMessages from "../../utils/utils/FieldMessages";
import { ErrorHookFallback } from "../../utils/utils/ErrorHookFallback";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks/hooks";
import useUploadHook from "../../../HOC/useUploadHook";
import { removeUpload } from "@/app/redux/slices/tasksSlice";

type FileUploadProps = {
  element: {
    name: string;
    id: string;
    accept?: string;
    maxSize?: number;
    required?: boolean;
    label?: string;
  };
  hook: any;
};

export default function FileUpload({ element, hook }: FileUploadProps) {
  const { control, unregister } = useFormContext();
  const dispatch = useAppDispatch();
  const { uploadResult } = useAppSelector((state) => state.tasksSlice);

  const {
    field: { ref: controllerRef, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name: element.name,
    control,
    defaultValue: null,
    rules: { required: element.required },
  });

  if (!hook) {
    return <ErrorHookFallback />;
  }

  const {
    inputRef,
    fileName,
    isUploading,
    uploadProgress,
    handleFileChange,
    handleCancelUpload,
  } = useUploadHook({ element, unregister });

  // Handle removing uploaded files
  const handleRemoveUpload = (index: number) => {
    dispatch(removeUpload(index));
  };

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      {element.label && <LabelComp element={element} />}

      <Box
        sx={{
          border: "1px dashed #ccc",
          borderRadius: 2,
          padding: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          minHeight: "120px",
          backgroundColor: "#fdfdfd",
        }}
      >
        {/* Upload Button with hidden input */}
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Button
            icon={<UploadOutlined />}
            style={{
              textTransform: "none",
              width: "130px",
              height: "150px",
              borderRadius: "8px",
            }}
          >
            إضافة مرفق
          </Button>

          <input
            type="file"
            accept={element.accept}
            ref={(el) => {
              controllerRef(el);
              inputRef.current = el;
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "130px",
              height: "150px",
              opacity: 0,
              cursor: "pointer",
            }}
            onChange={(e) => handleFileChange(e, onChange)}
            onBlur={onBlur}
            required={element.required}
            id={element.id}
          />
        </Box>

        {/* File Display / Progress */}
        <Box sx={{ flexGrow: 1 }}>
          {isUploading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ width: "100%", height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption">{uploadProgress}%</Typography>
              <IconButton onClick={handleCancelUpload}>
                <X size={16} />
              </IconButton>
            </Box>
          ) : fileName ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Paperclip size={16} />
                <Typography>{fileName}</Typography>
              </Box>
              <IconButton onClick={handleCancelUpload}>
                <X size={16} />
              </IconButton>
            </Box>
          ) : uploadResult.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              لا يوجد مرفقات
            </Typography>
          ) : null}

          {/* Display all uploaded files */}
          {uploadResult.length > 0 && !isUploading && !fileName && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                الملفات المرفوعة ({uploadResult.length}):
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {uploadResult.map((upload: any, index: number) => (
                  <Chip
                    key={index}
                    label={upload.fileName || upload.attachmentName || `ملف ${index + 1}`}
                    onDelete={() => handleRemoveUpload(index)}
                    icon={<Paperclip size={14} />}
                    variant="outlined"
                    sx={{ maxWidth: "200px" }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <FieldMessages element={element} error={error} />
    </Box>
  );
}