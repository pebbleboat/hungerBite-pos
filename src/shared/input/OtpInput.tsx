import clsx from "clsx";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import Text from "../heading/Text";

const OtpInputField = ({
  otp,
  setOtp,
  label,
  className,
  resend,
  errorMessage,
  prefix,
  numInputs,
}: {
  otp: string;
  setOtp: (item: string) => void;
  className?: string;
  label?: string;
  errorMessage?: string;
  resend?: () => void;
  prefix?: string;
  numInputs?: number;
}) => {
  const [count, setCount] = useState(30);
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (count > 0) {
      interval = setInterval(() => {
        setCount((p) => p - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [count]);
  return (
    <div className={clsx(className)}>
      {label && (
        <Text variant="secondary" size="sm" className="mb-[6px]">
          {label}
        </Text>
      )}
      <div className="space-y-3">
        <div className="flex gap-x-2">
          {prefix && (
            <div className="h-[50px] min-w-[50px] text-2xl rounded-[10px] border border-gray-300 flex justify-center items-center">
              {prefix}
            </div>
          )}
          <OTPInput
            value={otp}
            onChange={(e) => setOtp(e)}
            numInputs={numInputs || 6}
            // renderSeparator={(e) =>
            //   !prefix && e === 2 && <span className="min-w-4 h-1 bg-gray-300" />
            // }
            containerStyle="gap-x-2"
            renderInput={(props) => (
              <input
                {...props}
                placeholder="0"
                className={clsx(
                  "sm:h-[60px] h-[50px] sm:rounded-xl rounded-lg placeholder:text-placeholder-subtle text-3xl",
                  errorMessage
                    ? "border-[1.5px] border-error"
                    : props.value
                      ? "border-[1.5px] border-brand"
                      : "border border-gray-400",
                  prefix ? "!w-full" : "sm:!w-[60px] !w-[50px]",
                )}
              />
            )}
          />
        </div>
        <Text as="h6" variant="error-primary" size="sm">
          {errorMessage}
        </Text>
      </div>
      {resend && (
        <Text variant="tertiary" size="sm" className="mt-4">
          Didn’t receive OTP yet?{" "}
          <span
            className={clsx(
              "font-medium",
              count === 0
                ? "text-brand-tertiary cursor-pointer"
                : "cursor-not-allowed",
            )}
            role="button"
            tabIndex={0}
            onKeyDown={() => {}}
            onClick={
              count
                ? () => {}
                : () => {
                    setCount(30);
                    resend?.();
                    setOtp("");
                  }
            }
          >
            Resend Again
          </span>{" "}
          {count !== 0 && <span>(in {count} sec)</span>}
        </Text>
      )}
    </div>
  );
};

export default OtpInputField;
