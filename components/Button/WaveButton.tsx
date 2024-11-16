import React from "react";

interface WaveButtonProps {
  children?: React.ReactNode;
  props?: any;
  additionalStyles?: string;
  liquidStyles?: string;
  type?: "submit" | "button" | "reset";
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  link?: string;
  openInNewTab?: boolean;
}

const WaveButton = ({
  children,
  type,
  onClick,
  link,
  openInNewTab,
  additionalStyles,
  liquidStyles,
  ...props
}: WaveButtonProps) => {
  return (
    <a
      href={link}
      {...props}
      onClick={onClick}
      className={`wave-button rounded-full py-2 px-10 text-center cursor-pointer font-polysans uppercase ${additionalStyles}`}
    >
      <span>{children}</span>
      <div className={`liquid ${liquidStyles}`}></div>
    </a>
  );
};

export default WaveButton;
