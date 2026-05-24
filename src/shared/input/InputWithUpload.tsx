import { FiInfo, FiUpload } from "react-icons/fi";
import Button from "../buttons/Button";
import InputField, { IInputField } from "./InputField";
const InputWithUpload = ({
  label,
  inputProps,
  required,
}: {
  label?: string;
  required?: boolean;
  inputProps: IInputField;
}) => {
  return (
    <div className="flex flex-col gap-y-1">
      {label && (
        <label className="text-sm">
          {label} {required && <span className="text-red-500">&nbsp;*</span>}
        </label>
      )}
      <div className="flex items-center">
        <InputField className="w-full flex-1 !rounded-r-none" {...inputProps} />
        <Button
          variant="tertiary-color-link"
          size="sm"
          btnName="Upload"
          className="!rounded-l-none border border-brand-100 !bg-brand-50"
          icon={<FiUpload className="w-4 h-4" />}
          secondaryIcon={<FiInfo className="w-4 h-4 order-last ml-2" />}
        />
      </div>
    </div>
  );
};

export default InputWithUpload;
