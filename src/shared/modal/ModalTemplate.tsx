import Button from "@/shared/buttons/Button";
import clsx from "clsx";
import { FC, Fragment, PropsWithChildren, ReactNode } from "react";
import Divider from "@/shared/divider";
import InputField, { IInputField } from "@/shared/input/InputField";
import { IModal, Modal } from ".";
import { FaXmark } from "react-icons/fa6";
import InfoCluster from "@/shared/InfoCluster";
import IconWithBg from "@/shared/IconWithBg";
import { LuBuilding2 } from "react-icons/lu";

export interface IModalTemplate {
  className?: string;
  headerDetails?: {
    title: string;
    subtitle?: ReactNode;
    icon?: ReactNode;
  };
  inputProps?: IInputField;
  btnProps?: {
    leftBtnName?: string;
    rightBtnName?: string;
    btnWrapperClass?: string;
    isRightBtnLoading?: boolean;
    isLeftBtnLoading?: boolean;
    leftOnClick?: () => void;
    rightOnClick?: () => void;
    disabled?: boolean;
  } | null;
  modalProps: IModal;
}

export const ModalTemplate: FC<PropsWithChildren<IModalTemplate>> = ({
  children,
  className,
  headerDetails,
  inputProps,
  btnProps,
  modalProps,
}) => {
  return (
    <Modal {...modalProps}>
      {headerDetails && (
        <div className="flex items-center justify-between border-b border-b-gray-200 p-4">
          <InfoCluster
            titleProps={{
              children: headerDetails?.title,
              size: "lg",
              type: "semibold",
            }}
            descriptionProps={{
              children: headerDetails?.subtitle,
              size: "sm",
            }}
            textWrapperClass="!space-y-0"
            children={<IconWithBg icon={headerDetails?.icon} />}
          />
          <FaXmark
            size={24}
            className="ml-auto cursor-pointer text-secondary"
            onClick={modalProps.close}
          />
        </div>
      )}
      {inputProps?.name && (
        <div className="px-6 pt-6 pb-5">
          <InputField name={inputProps?.name} {...inputProps} />
        </div>
      )}
      <div className={clsx("overflow-y-scroll", className)}>{children}</div>
      {btnProps && (
        <div
          className={clsx(
            "flex p-4 border-t border-t-gray-200 w-full gap-x-3 mt-auto",
            btnProps.btnWrapperClass,
          )}
        >
          {btnProps?.leftBtnName && (
            <Button
              btnName={btnProps?.leftBtnName}
              variant="secondary"
              fullWidth
              onClick={btnProps?.leftOnClick || modalProps?.close}
              isLoading={btnProps?.isLeftBtnLoading}
            />
          )}
          {btnProps?.rightBtnName && (
            <Button
              btnName={btnProps?.rightBtnName}
              fullWidth
              onClick={btnProps?.rightOnClick}
              disabled={btnProps?.disabled}
              isLoading={btnProps?.isRightBtnLoading}
            />
          )}
        </div>
      )}
    </Modal>
  );
};
