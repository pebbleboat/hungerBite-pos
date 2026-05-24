import Image, { ImageProps } from "next/image";
import { ReactElement } from "react";

interface IImg extends Omit<ImageProps, "src"> {
  isLocal?: boolean;
  src?: string;
}

const Img = ({
  alt,
  src,
  width,
  height,
  isLocal,
  ...props
}: IImg): ReactElement | null => {
  if (!src) return null;

  const sourcePrefix = process.env.NEXT_PUBLIC_BASE_URL || "";
  const isAbsolute = src.startsWith("http://") || src.startsWith("https://");
  const source =
    !isLocal && sourcePrefix && !isAbsolute ? `${sourcePrefix}${src}` : src;

  return (
    <Image
      src={source}
      alt={alt}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default Img;
