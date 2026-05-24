import { FiAlertCircle, FiFileText, FiUpload } from "react-icons/fi";
import InfoCluster from "../InfoCluster";
import clsx from "clsx";
import {
  ChangeEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

const UPLOAD_FILE_ACCEPT_DEFAULT =
  "image/*,application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const UPLOAD_FILE_ACCEPT_IMAGES = "image/*";

const UPLOAD_FILE_ACCEPT_DOCUMENTS =
  "application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type UploadFileVariant = "image" | "document" | "mixed";

export type UploadFileChangeEvent = {
  target: {
    name?: string;
    value: File | File[] | null;
    file: File | null;
    files: File[];
  };
};

export type UploadFileValueSingle = File | null;
export type UploadFileValueMultiple = File[];
export type UploadFileValue = UploadFileValueSingle | UploadFileValueMultiple;

interface IUploadFile {
  label: string;
  required?: boolean;
  subText?: string;
  errorMessage?: string;
  name?: string;
  value?: UploadFileValue;
  multiple?: boolean;
  /** Default file picker filter from variant; ignored if `accept` is set. */
  variant?: UploadFileVariant;
  /** If set, overrides the accept string implied by `variant`. */
  accept?: string;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: UploadFileChangeEvent) => void;
}

function normalizeToFiles(
  multiple: boolean,
  value: UploadFileValue | undefined,
  internalFiles: File[],
): File[] {
  if (value === undefined) {
    return internalFiles;
  }
  if (multiple) {
    if (Array.isArray(value)) return value;
    if (value instanceof File) return [value];
    return [];
  }
  if (value instanceof File) return [value];
  if (value === null) return [];
  return [];
}

function formatFileSize(sizeInBytes: number) {
  if (!sizeInBytes) return "";
  const sizeInMB = sizeInBytes / (1024 * 1024);
  if (sizeInMB >= 1) return `${sizeInMB.toFixed(1)} MB`;
  const sizeInKB = sizeInBytes / 1024;
  return `${Math.max(1, Math.round(sizeInKB))} KB`;
}

function totalSize(files: File[]) {
  return files.reduce((sum, f) => sum + f.size, 0);
}

function acceptForVariant(variant: UploadFileVariant | undefined) {
  switch (variant) {
    case "image":
      return UPLOAD_FILE_ACCEPT_IMAGES;
    case "document":
      return UPLOAD_FILE_ACCEPT_DOCUMENTS;
    default:
      return UPLOAD_FILE_ACCEPT_DEFAULT;
  }
}

const UploadFile = ({
  label,
  required = false,
  subText,
  errorMessage,
  name,
  value,
  multiple = false,
  variant = "mixed",
  accept,
  onBlur,
  onChange,
}: IUploadFile) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = useState<File[]>([]);

  const resolvedAccept =
    accept !== undefined ? accept : acceptForVariant(variant);

  const isControlled = value !== undefined;

  const currentFiles = useMemo(
    () => normalizeToFiles(multiple, value, internalFiles),
    [multiple, value, internalFiles],
  );

  const previewSource = currentFiles[0];
  const previewIsImage = Boolean(previewSource?.type.startsWith("image/"));
  const previewIsDocument =
    Boolean(previewSource) && !previewSource!.type.startsWith("image/");

  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!previewSource || !previewIsImage) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(previewSource);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [previewSource, previewIsImage]);

  const emitChange = (next: File[]) => {
    const payload: UploadFileChangeEvent = {
      target: {
        name,
        value: multiple ? next : (next[0] ?? null),
        file: next[0] ?? null,
        files: next,
      },
    };
    onChange?.(payload);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    const next = multiple ? picked : picked.slice(0, 1);

    if (!isControlled) {
      setInternalFiles(next);
    }

    emitChange(next);
    event.target.value = "";
  };

  const handleContainerClick = () => {
    inputRef.current?.click();
  };

  const emptyUploadTitle =
    variant === "image"
      ? "Click here to upload image"
      : variant === "document"
        ? "Click here to upload document"
        : "Click here to upload file";

  const titleText = (() => {
    if (currentFiles.length === 0) return emptyUploadTitle;
    if (currentFiles.length === 1) return currentFiles[0].name;
    const names = currentFiles.map((f) => f.name).join(", ");
    return names.length > 42 ? `${currentFiles.length} files selected` : names;
  })();

  const descriptionText =
    currentFiles.length === 0
      ? subText
      : currentFiles.length === 1
        ? `Size: ${formatFileSize(currentFiles[0].size)}`
        : `Total: ${formatFileSize(totalSize(currentFiles))}`;

  return (
    <div className="space-y-1">
      <div className="text-sm">
        {label}
        {required && <span className="text-red-500">&nbsp;*</span>}
      </div>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        className="hidden"
        accept={resolvedAccept}
        multiple={multiple}
        onChange={handleFileChange}
        onBlur={onBlur}
      />
      <div onClick={handleContainerClick}>
        <InfoCluster
          children={
            <>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
                />
              ) : previewIsDocument || variant === "document" ? (
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FiFileText className="w-5 h-5 text-primary" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FiUpload className="w-5 h-5 text-primary" />
                </div>
              )}
              {errorMessage && (
                <FiAlertCircle className="w-4 h-4 text-red-500 order-last mr-1 ml-auto" />
              )}
            </>
          }
          titleProps={{
            children: titleText,
            size: "xs",
          }}
          descriptionProps={{
            children: descriptionText,
            size: "xxs",
          }}
          className={clsx(
            "border rounded-lg p-2 cursor-pointer",
            errorMessage ? "border-red-500" : "border-gray-100",
          )}
        />
      </div>
      {errorMessage && (
        <div className="text-xs text-red-600">{errorMessage}</div>
      )}
    </div>
  );
};

export default UploadFile;
