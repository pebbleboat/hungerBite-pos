import type { SVGProps } from "react";

export const SvgLogo = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 32"
    fill="none"
    aria-hidden
    className={className}
    {...props}
  >
    <circle cx="16" cy="16" r="14" fill="#0e214d" />
    <circle
      cx="28"
      cy="16"
      r="7"
      fill="#ffffff"
      stroke="#0e214d"
      strokeWidth={1.5}
    />
  </svg>
);
