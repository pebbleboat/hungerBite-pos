import clsx from "clsx";
import { FC, PropsWithChildren, ReactNode } from "react";
import Img from "@/shared/Img";
import Loader from "@/shared/Loader";
import { useRouter } from "next/navigation";
import { emptyState } from "@/utils/static";
import Button, { IButton } from "./buttons/Button";
import Text from "./heading/Text";

export interface IEmptyState {
  title?: string;
  subtitle?: string;
  btnProps?: IButton | null;
  icon?: ReactNode;
}
interface IEmpty {
  data?: IEmptyState;
  size?: "sm" | "xs";
  className?: string;
  pageData?: any[] | null | string;
  height?: number;
  loaderClass?: string;
  hideBtn?: boolean;
  loaderVariant?: "full-screen";
}

const EmptyState: FC<PropsWithChildren<IEmpty>> = ({
  data,
  size = "sm",
  className,
  pageData = "children",
  children,
  height,
  loaderClass,
  hideBtn,
  loaderVariant,
}) => {
  const router = useRouter();
  const renderEmptyContent = () => {
    return (
      <div
        className={clsx(
          "h-full relative flex flex-col justify-center items-center overflow-hidden",
          size === "sm" ? "space-y-6" : "space-y-8",
          className,
        )}
      >
        <Img
          src="/images/dots.png"
          height={480}
          width={480}
          alt="Empty State Icon"
          isLocal
          className="absolute -mt-36 object-cover"
        />
        <div
          className={clsx(
            "max-w-[370px] flex flex-col z-10 items-center mx-auto",
            size === "sm" ? "space-y-4" : "space-y-8",
          )}
        >
          {data?.icon || emptyState.icon}
          <div
            className={clsx(
              "text-center",
              size === "sm" ? "space-y-1" : "space-y-2",
            )}
          >
            <Text
              as="h6"
              className={clsx("w-max mx-auto", size === "sm" ? "" : "text-2xl")}
              type="semibold"
              variant="primary"
            >
              {data?.title || emptyState.title}
            </Text>
            <Text variant="tertiary" size={size}>
              {data?.subtitle || emptyState.subtitle}
            </Text>
          </div>
        </div>
        {!hideBtn && (
          <Button
            {...(data?.btnProps || emptyState.btnProps)}
            onClick={() => {
              if (data?.btnProps?.onClick) {
                data?.btnProps?.onClick();
              } else {
                router.back();
              }
            }}
            size="sm"
            className="max-w-[370px] mx-auto z-10"
          />
        )}
      </div>
    );
  };

  const renderLoader = () => (
    <Loader
      height={height}
      wrapperClass={clsx(loaderClass)}
      variant={loaderVariant}
    />
  );

  return !pageData
    ? renderLoader()
    : pageData?.length === 0
      ? renderEmptyContent()
      : children;
};

export default EmptyState;
