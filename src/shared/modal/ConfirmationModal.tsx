import clsx from "clsx";
import { FaSave } from "react-icons/fa";
import { FaCircle, FaRegTrashCan, FaTrash } from "react-icons/fa6";
import { GoCheckCircle } from "react-icons/go";
import Button from "@/shared/buttons/Button";
import { ModalTemplate } from "./ModalTemplate";
import { FiTrash2 } from "react-icons/fi";

const ConfirmationModal = ({
  close,
  isOpen,
  leftBtnName = "Cancel",
  rightBtnName,
  onSubmit,
  title,
  description,
  type,
  size = "md",
  styleHeader,
  isLoading,
}: {
  isOpen: boolean;
  close: () => void;
  onSubmit: () => void;
  leftBtnName?: string;
  rightBtnName: string;
  title: string;
  description: string;
  type: "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  styleHeader?: string;
  isLoading?: boolean;
}) => {
  return (
    <ModalTemplate
      className="p-6 space-y-4"
      modalProps={{ close, isOpen, size }}
    >
      <div className={clsx("space-y-4", styleHeader)}>
        <div className="flex w-max justify-center relative">
          <div
            className={clsx(
              "w-12 h-12 flex justify-center items-center rounded-full border",
              {
                "bg-green-50 border-green-200": type === "success",
                "bg-yellow-50 border-yellow-200": type === "warning",
                "bg-red-50 border-red-200": type === "danger",
              },
            )}
          >
            <div
              className={clsx(
                "h-8 w-8 rounded-full flex justify-center items-center",
                {
                  "bg-green-600": type === "success",
                  "bg-yellow-600": type === "warning",
                  "bg-red-600": type === "danger",
                },
              )}
            >
              {type === "success" ? (
                <GoCheckCircle size={16} className="text-white" />
              ) : type === "warning" ? (
                <FaSave size={16} className="text-white" />
              ) : (
                <FiTrash2 size={16} className="text-white" />
              )}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-bold">{title}</div>
          <div className="text-sm text-tertiary">{description}</div>
        </div>
      </div>
      <div className="flex sm:flex-row flex-col items-start sm:items-center gap-3 !mt-8">
        <div
          className={clsx(
            "flex sm:flex-row flex-col justify-end gap-3 w-full ml-auto",
            { "sm:w-max": size === "lg" || size === "md" },
          )}
        >
          <Button
            btnName={leftBtnName}
            onClick={close}
            variant="secondary"
            fullWidth
          />
          <Button
            btnName={rightBtnName}
            onClick={onSubmit}
            variant={type === "danger" ? "error" : "primary"}
            fullWidth
            isLoading={isLoading}
          />
        </div>
      </div>
    </ModalTemplate>
  );
};

export default ConfirmationModal;
