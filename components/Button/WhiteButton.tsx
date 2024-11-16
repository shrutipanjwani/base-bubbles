// components/Button/WhiteButton.tsx
import React, { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type HTMLButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type HTMLAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

interface BaseButtonProps {
  children?: React.ReactNode;
  additionalStyles?: string;
  type?: "button" | "submit" | "reset" | "link";
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  link?: string;
  openInNewTab?: boolean;
}

type ButtonProps = BaseButtonProps &
  (
    | ({ type: "link" } & HTMLAnchorProps)
    | ({ type?: "button" | "submit" | "reset" } & HTMLButtonProps)
  );

const buttonStyles =
  "relative inline-flex items-center text-black bg-white rounded-full";

const WhiteButton = ({
  children,
  type = "button",
  onClick,
  link,
  openInNewTab,
  additionalStyles = "",
  ...props
}: ButtonProps) => {
  if (type === "link") {
    return (
      <a
        href={link}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        className={`${buttonStyles} ${additionalStyles} cursor-pointer`}
        onClick={onClick}
        {...(props as HTMLAnchorProps)}
      >
        {children}
      </a>
    );
  }

  return (
    <div className="btn-holder">
      <button
        type={type}
        onClick={onClick}
        className={`${buttonStyles} ${additionalStyles}`}
        {...(props as HTMLButtonProps)}
      >
        <span>{children}</span>
      </button>
    </div>
  );
};

export default WhiteButton;
