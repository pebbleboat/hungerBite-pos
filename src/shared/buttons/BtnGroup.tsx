import clsx from "clsx";
import { Fragment } from "react";
import Button from "./Button";

interface BtnGroupProps {
  buttons: { label: string; value: string; icon?: React.ReactNode }[];
  onClick: (btn: { label: string; value: string }) => void;
  selected: string;
  className?: string;
  styleBtn?: string;
  wrapperClass?: string;
  label?: string;
  required?: boolean;
}
const BtnGroup = ({
  buttons,
  onClick,
  selected,
  className,
  styleBtn,
  wrapperClass,
  label,
  required,
}: BtnGroupProps) => {
  return (
    <div className={clsx("flex flex-col gap-y-1", wrapperClass)}>
      {label && (
        <label className="text-sm">
          {label}
          {required && <span className="text-red-500">&nbsp;*</span>}
        </label>
      )}
      <div
        className={clsx(
          "border flex w-max bg-white border-gray-200 rounded-lg [&>*:first-child]:!rounded-l-lg [&>*:last-child]:!rounded-r-lg",
          className,
        )}
      >
        {buttons?.map((item, idx) => (
          <Fragment key={item?.value}>
            <Button
              btnName={item?.label}
              icon={item?.icon}
              variant={
                item?.value === selected ? "secondary-color" : "secondary"
              }
              className={clsx(
                "!border-none rounded-none",
                item?.value === selected && "!bg-brand-50",
                styleBtn,
              )}
              onClick={() => onClick(item)}
              key={item?.value}
            />
            {idx !== buttons?.length - 1 && (
              <div className="min-h-full w-[1px] border-r border-r-gray-200" />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default BtnGroup;
