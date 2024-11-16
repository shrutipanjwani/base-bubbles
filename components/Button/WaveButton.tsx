// components/Button/WaveButton.tsx
import React, { AnchorHTMLAttributes } from "react";

interface WaveButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  additionalStyles?: string;
  liquidStyles?: string;
  type?: "submit" | "button" | "reset";
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  link?: string;
  openInNewTab?: boolean;
}

const WaveButton = ({
  children,
  onClick,
  link,
  openInNewTab,
  additionalStyles = "",
  liquidStyles = "",
  ...props
}: WaveButtonProps) => {
  return (
    <a
      href={link}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      onClick={onClick}
      className={`wave-button rounded-full py-2 px-10 text-center cursor-pointer font-polysans uppercase ${additionalStyles}`}
      {...props}
    >
      <span>{children}</span>
      <div className={`liquid ${liquidStyles}`}></div>
    </a>
  );
};

export default WaveButton;
